import { Injectable } from '@angular/core';

export interface TransactionData {
  transactionType: string;
  transactions: {
    debitCredit: string;
    accountCode: string;
    accountName: string;
    accountCategory: string;
    amount: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'journal_entries_data';

  // 保存所有数据到会话存储
  saveTransactions(data: TransactionData[]) {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  // 获取所有数据
  getTransactions(): TransactionData[] {
    const data = sessionStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // 更新特定交易组的数据
  updateTransactionGroup(groupIndex: number, data: TransactionData) {
    const allData = this.getTransactions();
    allData[groupIndex] = data;
    this.saveTransactions(allData);
  }

  // 删除特定交易组中的某条记录
  deleteTransaction(groupIndex: number, transactionIndex: number) {
    const allData = this.getTransactions();
    if (allData[groupIndex] && allData[groupIndex].transactions.length > 2) {
      allData[groupIndex].transactions.splice(transactionIndex, 1);
      this.saveTransactions(allData);
    }
  }

  // 获取所有已保存的 Account Code
  getAllAccountCodes(): { accountCode: string, accountName: string, accountCategory: string }[] {
    const allData = this.getTransactions();
    const uniqueCodes = new Map<string, { accountCode: string, accountName: string, accountCategory: string }>();
    
    allData.forEach(group => {
      group.transactions.forEach(transaction => {
        if (transaction.accountCode) {
          uniqueCodes.set(transaction.accountCode, {
            accountCode: transaction.accountCode,
            accountName: transaction.accountName,
            accountCategory: transaction.accountCategory
          });
        }
      });
    });

    return Array.from(uniqueCodes.values());
  }

  // 初始化存储
  initializeStorage() {
    if (!this.getTransactions().length) {
      const initialData: TransactionData[] = [
        { transactionType: 'Top-up', transactions: [] },
        { transactionType: 'Transfer', transactions: [] },
        { transactionType: 'Withdraw', transactions: [] }
      ];
      this.saveTransactions(initialData);
    }
  }

  // 清除存储
  clearStorage() {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
} 