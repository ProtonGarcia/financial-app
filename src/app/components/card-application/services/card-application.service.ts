import { Injectable } from '@angular/core';
import { AddressProof, CardApplication, DocumentStatus, RiskResult } from '../models/card-application.model';

const APPLICATION_KEY = 'card-application';
const COUNTER_KEY = 'card-application.counter';
const DOCUMENTS_KEY = 'card-application.documents';
const MAX_DOCUMENT_BYTES = 5 * 1024 * 1024;

const documentKey = (name: string, size: number) => `${name}|${size}`;

@Injectable({ providedIn: 'root' })
export class CardApplicationService {
  createApplication(): CardApplication {
    const counter = Number(localStorage.getItem(COUNTER_KEY) ?? 0) + 1;
    localStorage.setItem(COUNTER_KEY, String(counter));

    const application: CardApplication = {
      id: `FP-${new Date().getFullYear()}-${String(counter).padStart(6, '0')}`,
      currentStep: 0,
      status: 'DRAFT'
    };
    this.saveProgress(application);
    return application;
  }

  getApplication(): CardApplication | null {
    const raw = localStorage.getItem(APPLICATION_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as CardApplication;
    } catch {
      return null;
    }
  }

  saveProgress(application: CardApplication): void {
    localStorage.setItem(APPLICATION_KEY, JSON.stringify(application));
  }

  hasPendingApplication(): boolean {
    return this.getApplication()?.status === 'DRAFT';
  }

  clearApplication(): void {
    localStorage.removeItem(APPLICATION_KEY);
  }

  completeApplication(): void {
    const application = this.getApplication();
    if (application) {
      this.saveProgress({ ...application, status: 'COMPLETED' });
    }
  }

  validateDocument(file: { name: string; size: number }, current?: AddressProof | null): DocumentStatus {
    if (file.size === 0 || file.size > MAX_DOCUMENT_BYTES) {
      return 'INVALID';
    }
    const key = documentKey(file.name, file.size);
    if (current && documentKey(current.fileName, current.fileSize ?? -1) === key) {
      return 'VALID';
    }
    return this.knownDocuments().includes(key) ? 'DUPLICATE' : 'VALID';
  }

  registerDocument(proof: AddressProof): void {
    const key = documentKey(proof.fileName, proof.fileSize ?? 0);
    const known = this.knownDocuments();
    if (!known.includes(key)) {
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify([...known, key]));
    }
  }

  private knownDocuments(): string[] {
    try {
      return JSON.parse(localStorage.getItem(DOCUMENTS_KEY) ?? '[]') as string[];
    } catch {
      return [];
    }
  }

  calculateRisk(application: CardApplication): RiskResult {
    const profile = application.economicProfile;
    const ratio = profile && profile.monthlyIncome > 0
      ? profile.monthlyExpenses / profile.monthlyIncome
      : 1;
    const score = Math.max(0, Math.min(100, Math.round(100 - ratio * 60)));
    const level = score >= 70 ? 'LOW' : score >= 40 ? 'MEDIUM' : 'HIGH';
    return { score, level };
  }
}
