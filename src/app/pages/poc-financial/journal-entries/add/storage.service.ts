import { Injectable } from '@angular/core';

interface Transaction {
  debitCredit: string;
  financialType: string;
  accountCode: string;
  accountName: string;
  accountCategory: string;
  amount: string;
}

export interface TransactionData {
  transactionType: string;
  transactions: Transaction[];
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'journalEntries';

  constructor() {}

  saveTransactions(data: TransactionData[]): void {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  getTransactions(): TransactionData[] {
    const data = sessionStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  updateTransactionGroup(index: number, data: TransactionData): void {
    const transactions = this.getTransactions();
    transactions[index] = data;
    this.saveTransactions(transactions);
  }

  deleteTransaction(groupIndex: number, transactionIndex: number): void {
    const transactions = this.getTransactions();
    if (transactions[groupIndex] && transactions[groupIndex].transactions) {
      transactions[groupIndex].transactions.splice(transactionIndex, 1);
      this.saveTransactions(transactions);
    }
  }

  clearStorage(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
} 