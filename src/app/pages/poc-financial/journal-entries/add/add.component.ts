import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { TokenInfo, TokenResponse, SubjectInfo, SubjectResponse } from './token.interface';
import { StorageService, TransactionData } from './storage.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  transactionForm: FormGroup;
  isFormSubmitted = false;
  touchedGroups: Set<number> = new Set();
  tokenList: TokenInfo[] = [];
  selectedToken: TokenInfo | null = null;
  transactionTypes = ['Top-up', 'Transfer', 'Withdraw'];
  subjectList: SubjectInfo[] = [];
  currentFilteredSubjects: { [key: string]: any[] } = {};
  loadingSubjects: { [key: string]: boolean } = {};
  private allSubjects: SubjectInfo[] = []; // 存储所有科目数据

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.transactionForm = this.fb.group({
      ledgerName: ['', [Validators.required]],
      tokenName: ['', Validators.required],
      transactionGroups: this.fb.array([])
    });
  }

  get transactionGroups() {
    return this.transactionForm.get('transactionGroups') as FormArray;
  }

  ngOnInit() {
    this.getTokenList();
  }

  // 获取 ledgerName 的表单控件
  get ledgerNameControl() {
    return this.transactionForm.get('ledgerName');
  }

  // 检查 ledgerName 是否有错误
  isLedgerNameInvalid(): boolean {
    const control = this.ledgerNameControl;
    if (!control) {
      return false;
    }
    return this.isFormSubmitted && 
           control.invalid && 
           (control.dirty || control.touched);
  }

  // 初始化科目列表
  private initSubjectList(stablecoinId: number) {
    this.loadingSubjects['init'] = true;
    
    // 获取会话存储中的科目
    const storedSubjects = this.getAllStoredSubjects();
    
    // 从接口获取科目列表
    this.http.post<{ code: number; data: SubjectInfo[]; message: string }>(
      '/v1/financial/bill/rule/add/subjectList',
      { stablecoinId: stablecoinId }
    ).subscribe({
      next: (response) => {
        if (response.code === 0 && response.data) {
          // 合并并去重
          this.allSubjects = this.mergeAndDeduplicateSubjects(storedSubjects, response.data);
        }
        this.loadingSubjects['init'] = false;
      },
      error: (error) => {
        console.error('获取科目列表错误:', error);
        this.allSubjects = storedSubjects;
        this.loadingSubjects['init'] = false;
      }
    });
  }

  private getTokenList() {
    this.http.post<TokenResponse>('/v1/financial/bill/rule/add/tokenList', {})
      .subscribe({
        next: (response) => {
          if (response.code === 0 && response.data) {
            this.tokenList = response.data;
            if (this.tokenList.length > 0) {
              this.selectedToken = this.tokenList[0];
              this.transactionForm.patchValue({
                tokenName: this.selectedToken
              });
              // 初始化科目列表
              this.initSubjectList(this.selectedToken.stablecoinId);
              this.getSubjectList(this.selectedToken.stablecoinId);
            }
          }
        },
        error: (error) => {
          this.message.error('获取Token列表失败');
          console.error('获取Token列表错误:', error);
        }
      });
  }

  private getSubjectList(stablecoinId: number) {
    this.http.post<SubjectResponse>('/v1/financial/bill/rule/add/subjectList', { stablecoinId })
      .subscribe({
        next: (response) => {
          if (response.code === 0 && response.data && response.data.length > 0) {
            const defaultSubject = response.data[0];
            
            // 清空现有的交易组
            while (this.transactionGroups.length) {
              this.transactionGroups.removeAt(0);
            }

            // 创建新的交易组
            this.transactionTypes.forEach(type => {
              const group = this.fb.group({
                transactionType: [type, Validators.required],
                transactions: this.fb.array([])
              });

              const transactionsArray = group.get('transactions') as FormArray;
              // 每个交易组添加两个默认的交易记录
              for (let i = 0; i < 2; i++) {
                const transaction = this.fb.group({
                  debitCredit: ['Debit', Validators.required],
                  accountCode: [defaultSubject.subjectCode, Validators.required],
                  accountName: [defaultSubject.subjectTitle, Validators.required],
                  amount: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
                  accountCategory: [defaultSubject.subjectCategory, Validators.required]
                });
                transactionsArray.push(transaction);
              }

              this.transactionGroups.push(group);
            });

            // 保存到会话存储
            const initialData = this.transactionGroups.controls.map(group => ({
              transactionType: group.get('transactionType')?.value,
              transactions: (group.get('transactions') as FormArray).controls.map(t => ({
                debitCredit: t.get('debitCredit')?.value,
                accountCode: t.get('accountCode')?.value,
                accountName: t.get('accountName')?.value,
                accountCategory: t.get('accountCategory')?.value,
                amount: t.get('amount')?.value
              }))
            }));
            this.storageService.saveTransactions(initialData);
          }
        },
        error: (error) => {
          this.message.error('获取科目列表失败');
          console.error('获取科目列表错误:', error);
        }
      });
  }

  onTokenSelect(tokenInfo: TokenInfo) {
    this.selectedToken = tokenInfo;
    if (this.selectedToken) {
      // 切换 token 时重新初始化科目列表
      this.initSubjectList(this.selectedToken.stablecoinId);
      this.getSubjectList(this.selectedToken.stablecoinId);
    }
  }

  getTransactions(group: AbstractControl): FormArray {
    return group.get('transactions') as FormArray;
  }

  isFieldInvalid(control: AbstractControl, fieldName: string, groupIndex: number): boolean {
    if (!this.touchedGroups.has(groupIndex) && !this.isFormSubmitted) {
      return false;
    }
    const field = control.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched || this.isFormSubmitted)) : false;
  }

  getFilteredSubjects(groupIndex: number, transactionIndex: number): any[] {
    const key = `${groupIndex}-${transactionIndex}`;
    return this.currentFilteredSubjects[key] || [];
  }

  onAccountCodeSelect(transaction: AbstractControl, subject: SubjectInfo, groupIndex: number, transactionIndex: number) {
    transaction.patchValue({
      accountCode: subject.subjectCode,
      accountName: subject.subjectTitle,
      accountCategory: subject.subjectCategory
    });
    const key = `${groupIndex}-${transactionIndex}`;
    this.currentFilteredSubjects[key] = [];
  }

  addSingleTransaction(groupIndex: number) {
    const transactionGroup = this.transactionGroups.at(groupIndex);
    const transactions = transactionGroup.get('transactions') as FormArray;
    
    // Get the last transaction in the group
    const lastTransaction = transactions.at(transactions.length - 1);
    
    // Create a new transaction with values from the last transaction
    const newTransaction = this.fb.group({
      debitCredit: [lastTransaction.get('debitCredit')?.value || 'Debit', Validators.required],
      accountCode: [lastTransaction.get('accountCode')?.value || '', Validators.required],
      accountName: [lastTransaction.get('accountName')?.value || '', Validators.required],
      amount: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      accountCategory: [lastTransaction.get('accountCategory')?.value || '', Validators.required]
    });

    transactions.push(newTransaction);
  }

  addTransactionGroup() {
    const group = this.fb.group({
      transactionType: ['Top-up', Validators.required],
      transactions: this.fb.array([])
    });
    this.transactionGroups.push(group);
  }

  onSubmit() {
    this.isFormSubmitted = true;
    
    // 触发所有控件的验证
    Object.keys(this.transactionForm.controls).forEach(key => {
      const control = this.transactionForm.get(key);
      if (control) {
        control.markAsDirty();
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });

    // 触发所有交易组的验证
    this.transactionGroups.controls.forEach((group: AbstractControl) => {
      if (group instanceof FormGroup) {
        const transactionsArray = group.get('transactions');
        if (transactionsArray instanceof FormArray) {
          transactionsArray.controls.forEach((transaction: AbstractControl) => {
            if (transaction instanceof FormGroup) {
              Object.keys(transaction.controls).forEach(field => {
                const fieldControl = transaction.get(field);
                if (fieldControl) {
                  fieldControl.markAsDirty();
                  fieldControl.markAsTouched();
                  fieldControl.updateValueAndValidity();
                }
              });
            }
          });
        }
      }
    });

    if (this.transactionForm.valid) {
      // 获取 Selecting Token 部分的数据
      const selectingTokenData = {
        ledgerName: this.transactionForm.get('ledgerName')?.value,
        tokenName: this.selectedToken?.tokenName,
        tokenType: this.selectedToken?.tokenType === 5 ? 'Tokenized Deposit' : 'Digital Currency',
        peggedCurrency: this.selectedToken?.currencySymbol,
        tokenPrice: `1 ${this.selectedToken?.tokenSymbol} = ${this.selectedToken?.usPrice} ${this.selectedToken?.currencySymbol}`
      };

      // 获取 Transaction Details 部分的数据
      const transactionDetailsData = this.transactionGroups.controls.map(group => ({
        transactionType: group.get('transactionType')?.value,
        transactions: (group.get('transactions') as FormArray).controls.map(transaction => ({
          debitCredit: transaction.get('debitCredit')?.value,
          accountCode: transaction.get('accountCode')?.value,
          accountName: transaction.get('accountName')?.value,
          amount: transaction.get('amount')?.value,
          accountCategory: transaction.get('accountCategory')?.value
        }))
      }));

      // 打印完整数据
      console.log('Form Data:', {
        selectingToken: selectingTokenData,
        transactionDetails: transactionDetailsData
      });

      this.message.success('提交成功');
    } else {
      this.message.error('请检查表单是否填写正确');
    }
  }

  private createTransaction() {
    return this.fb.group({
      debitCredit: ['Debit', Validators.required],
      accountCode: ['', Validators.required],
      accountName: ['', Validators.required],
      amount: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      accountCategory: ['', Validators.required]
    });
  }

  // 搜索过滤方法
  onAccountCodeSearch(event: Event, groupIndex: number, transactionIndex: number): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    const key = `${groupIndex}-${transactionIndex}`;
    
    if (value) {
      this.loadingSubjects[key] = true;
      
      // 获取最新的会话存储数据
      const storedSubjects = this.getAllStoredSubjects();
      
      // 检查是否有新的会话存储数据需要合并
      const newSubjects = storedSubjects.filter(stored => 
        !this.allSubjects.some(existing => 
          existing.subjectCode === stored.subjectCode
        )
      );
      
      if (newSubjects.length > 0) {
        // 有新数据，更新 allSubjects
        this.allSubjects = this.mergeAndDeduplicateSubjects(this.allSubjects, newSubjects);
      }
      
      // 从已有数据中筛选
      this.currentFilteredSubjects[key] = this.allSubjects.filter(item => 
        item.subjectCode.toLowerCase().includes(value) ||
        item.subjectTitle.toLowerCase().includes(value)
      );
      
      this.loadingSubjects[key] = false;
    } else {
      this.currentFilteredSubjects[key] = [];
      this.loadingSubjects[key] = false;
    }
  }

  // 获取会话存储中的所有科目
  private getAllStoredSubjects(): SubjectInfo[] {
    const storedData = this.storageService.getTransactions();
    const subjects = new Set<string>();
    const result: SubjectInfo[] = [];

    // 遍历所有交易组和交易记录
    storedData.forEach(group => {
      group.transactions.forEach(transaction => {
        // 使用科目代码作为唯一标识符
        if (transaction.accountCode && !subjects.has(transaction.accountCode)) {
          subjects.add(transaction.accountCode);
          result.push({
            financialSubjectId: 0, // 会话存储中的数据没有这个ID
            stablecoinId: this.selectedToken?.stablecoinId || 0,
            subjectCategory: transaction.accountCategory,
            subjectCode: transaction.accountCode,
            subjectTitle: transaction.accountName
          });
        }
      });
    });

    return result;
  }

  // 合并并去重科目列表
  private mergeAndDeduplicateSubjects(stored: SubjectInfo[], api: SubjectInfo[]): SubjectInfo[] {
    const uniqueSubjects = new Map<string, SubjectInfo>();
    
    // 先添加存储的科目
    stored.forEach(subject => {
      uniqueSubjects.set(subject.subjectCode, subject);
    });
    
    // 再添加API返回的科目，如果有重复会覆盖存储的科目
    api.forEach(subject => {
      uniqueSubjects.set(subject.subjectCode, subject);
    });
    
    return Array.from(uniqueSubjects.values());
  }

  // 保存单条记录
  onSaveTransaction(transaction: AbstractControl, groupIndex: number, transactionIndex: number) {
    if (!transaction.valid) {
      this.message.error('请检查输入是否正确');
      return;
    }

    // 调用保存科目的 API
    const subjectData = {
      stablecoinId: this.selectedToken?.stablecoinId,
      subjectCategory: transaction.get('accountCategory')?.value,
      subjectCode: transaction.get('accountCode')?.value,
      subjectTitle: transaction.get('accountName')?.value
    };

    this.http.post('/v1/financial/bill/rule/add/subject/save', subjectData)
      .subscribe({
        next: (response: any) => {
          if (response.code === 0) {
            // 保存到会话存储
            const group = this.transactionGroups.at(groupIndex);
            const currentData: TransactionData = {
              transactionType: group.get('transactionType')?.value,
              transactions: (group.get('transactions') as FormArray).controls.map(t => ({
                debitCredit: t.get('debitCredit')?.value,
                accountCode: t.get('accountCode')?.value,
                accountName: t.get('accountName')?.value,
                accountCategory: t.get('accountCategory')?.value,
                amount: t.get('amount')?.value
              }))
            };

            this.storageService.updateTransactionGroup(groupIndex, currentData);
            this.message.success('保存成功');
          } else {
            this.message.error(response.msg || '保存失败');
          }
        },
        error: (error) => {
          console.error('保存科目错误:', error);
          this.message.error('保存失败，请稍后重试');
        }
      });
  }

  // 删除记录
  removeTransaction(groupIndex: number, transactionIndex: number) {
    const transactions = this.transactionGroups.at(groupIndex).get('transactions') as FormArray;
    if (transactions.length > 2) {
      transactions.removeAt(transactionIndex);
      this.storageService.deleteTransaction(groupIndex, transactionIndex);
      this.message.success('删除成功');
    }
  }

  // 加载存储的数据
  private loadStoredData() {
    const storedData = this.storageService.getTransactions();
    if (storedData.length > 0) {
      // 清空现有的交易组
      while (this.transactionGroups.length) {
        this.transactionGroups.removeAt(0);
      }

      // 加载存储的数据
      storedData.forEach(groupData => {
        const group = this.fb.group({
          transactionType: [groupData.transactionType, Validators.required],
          transactions: this.fb.array([])
        });

        const transactionsArray = group.get('transactions') as FormArray;
        if (groupData.transactions && groupData.transactions.length > 0) {
          groupData.transactions.forEach(transaction => {
            transactionsArray.push(this.fb.group({
              debitCredit: [transaction.debitCredit || 'Debit', Validators.required],
              accountCode: [transaction.accountCode, Validators.required],
              accountName: [transaction.accountName, Validators.required],
              amount: [{ value: transaction.amount, disabled: true }, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
              accountCategory: [transaction.accountCategory, Validators.required]
            }));
          });
        } else {
          // 如果没有交易记录，添加两个空的交易记录
          for (let i = 0; i < 2; i++) {
            transactionsArray.push(this.createTransaction());
          }
        }

        this.transactionGroups.push(group);
      });
    } else {
      // 如果没有存储的数据，创建默认的交易组
      this.transactionTypes.forEach(type => {
        const group = this.fb.group({
          transactionType: [type, Validators.required],
          transactions: this.fb.array([])
        });

        const transactionsArray = group.get('transactions') as FormArray;
        for (let i = 0; i < 2; i++) {
          transactionsArray.push(this.createTransaction());
        }

        this.transactionGroups.push(group);
      });
    }
  }

  // ... 其他已有的方法 ...
}