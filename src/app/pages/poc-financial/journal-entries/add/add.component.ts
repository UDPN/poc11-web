import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import {
  TokenInfo,
  TokenResponse,
  SubjectInfo,
  SubjectResponse
} from './token.interface';
import { StorageService } from './storage.service';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ActivatedRoute, Router } from '@angular/router';

// Add TransactionData interface definition
interface Transaction {
  debitCredit: string;
  financialCategory: string;
  sstv: string;
  accountCode: string;
  accountName: string;
  accountCategory: string;
  amount: string;
}

export interface TransactionData {
  transactionType: string;
  transactions: Transaction[];
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  transactionForm: FormGroup;
  isFormSubmitted = false;
  touchedGroups: Set<number> = new Set();
  tokenList: TokenInfo[] = [];
  selectedToken: TokenInfo | null = null;
  transactionTypes = ['Top-Up', 'Withdraw', 'Internal Transfer','External Transfer out','External Transfer in','External  FX Transfer out','External  FX Transfer in','FX Purchasing -Transfer out','FX Purchasing -Transfer in'];
  subjectList: SubjectInfo[] = [];
  currentFilteredSubjects: { [key: string]: any[] } = {};
  loadingSubjects: { [key: string]: boolean } = {};
  private allSubjects: SubjectInfo[] = [];
  isEditMode = false;
  ruleId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private http: HttpClient,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.transactionForm = this.fb.group({
      ledgerName: ['', [Validators.required]],
      tokenName: ['', Validators.required],
      transactionGroups: this.fb.array([])
    });
  }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumbs: [
        { name: 'Financial Management' },
        { name: 'Journal Entries', url: '/poc/poc-financial/journal-entries' },
        { name: this.isEditMode ? 'Edit' : 'Add' }
      ],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };

  ngOnInit() {
    // Check if we're in edit mode
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.ruleId = id;
        this.loadDetailData(id);
      }
    });
    this.getTokenList();
  }

  private loadDetailData(ruleId: string) {
    this.http.post('/v1/financial/bill/rule/detail', { ruleId }).subscribe({
      next: (response: any) => {
        if (response.code === 0 && response.data) {
          const detail = response.data;

          // 直接设置 token 信息
          this.selectedToken = {
            stablecoinId: detail.stablecoinId,
            tokenName: detail.tokenName,
            tokenType: 1,
            tokenSymbol: detail.tokenSymbol || '',
            tokenPrice: detail.tokenPrice || '1',
            decimalPrecision: 2,
            currencySymbol: detail.currencySymbol || '',
            usPrice: detail.usPrice || '1',
            blockchainCode: '',
            blockchainName: '',
            blockchainId: 0,
            blockchainNameAbbreviation: ''
          };

          // 设置表单值，在编辑模式下也需要设置 tokenName
          this.transactionForm.patchValue({
            ledgerName: detail.ledgerName,
            tokenName: this.selectedToken // 确保在编辑模式下也设置 tokenName
          });

          // 清除现有的交易组
          while (this.transactionGroups.length) {
            this.transactionGroups.removeAt(0);
          }

          // 创建交易组
          detail.txBillRuleList.forEach((rule: any) => {
            let transactionType: string;
            switch (rule.txType) {
              case 1:
                transactionType = 'Top-Up';
                break;
              case 2:
                transactionType = 'Withdraw';
                break;
              case 3:
                transactionType = 'Transfer';
                break;
              default:
                transactionType = 'Top-Up';
            }

            const group = this.fb.group({
              transactionType: [transactionType, Validators.required],
              transactions: this.fb.array([])
            });

            const transactionsArray = group.get('transactions') as FormArray;
            rule.loanRuleList.forEach((loan: any) => {
              const transaction = this.fb.group({
                debitCredit: [
                  loan.loanType === 1 ? 'Debit' : 'Credit',
                  Validators.required
                ],
                financialCategory: [loan.financialCategory || '1', Validators.required],
                sstv: [loan.sstv || '1', Validators.required],
                accountCode: [loan.subjectCode, Validators.required],
                accountName: [loan.subjectTitle, Validators.required],
                amount: [
                  { value: '', disabled: true },
                  [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]
                ],
                accountCategory: [loan.subjectCategory]
              });
              transactionsArray.push(transaction);
            });

            this.transactionGroups.push(group);
          });
        }
      },
      error: (error) => {
        console.error('Error loading detail:', error);
        this.message.error('Failed to load detail data');
      }
    });
  }

  get transactionGroups() {
    return this.transactionForm.get('transactionGroups') as FormArray;
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
    return (
      this.isFormSubmitted &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  // 初始化科目列表
  private initSubjectList(stablecoinId: number) {
    this.loadingSubjects['init'] = true;

    // 获取会话存储中的科目
    const storedSubjects = this.getAllStoredSubjects();

    // 从接口获取科目列表
    this.http
      .post<{ code: number; data: SubjectInfo[]; message: string }>(
        '/v1/financial/bill/rule/add/subjectList',
        { stablecoinId: stablecoinId }
      )
      .subscribe({
        next: (response) => {
          if (response.code === 0 && response.data) {
            // 合并并去重
            this.allSubjects = this.mergeAndDeduplicateSubjects(
              storedSubjects,
              response.data
            );
          }
          console.log(this.allSubjects);
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
    this.http
      .post<TokenResponse>('/v1/financial/bill/rule/add/tokenList', {})
      .subscribe({
        next: (response) => {
          if (response.code === 0 && response.data) {
            this.tokenList = response.data;
            // 只在新增模式下自动选中第一个 token
            if (!this.isEditMode && this.tokenList.length > 0) {
              this.transactionForm.patchValue({
                tokenName: this.tokenList[0]
              });
              this.onTokenSelect(this.tokenList[0]);
            }
          }
        },
        error: (error) => {
          console.error('Error getting token list:', error);
        }
      });
  }

  onTokenSelect(event: any) {
    this.selectedToken = event;
    if (this.selectedToken) {
      // 清除现有的交易组
      while (this.transactionGroups.length) {
        this.transactionGroups.removeAt(0);
      }

      // 创建默认的交易组
      this.transactionTypes.forEach((type) => {
        const group = this.fb.group({
          transactionType: [type, Validators.required],
          transactions: this.fb.array([])
        });

        const transactionsArray = group.get('transactions') as FormArray;
        // 根据交易类型决定默认行数
        const defaultRows = this.getDefaultRowCount(type);

        for (let i = 0; i < defaultRows; i++) {
          const transaction = this.fb.group({
            debitCredit: [
              this.getDefaultDebitCredit(type, i),
              Validators.required
            ],
            financialCategory: ['1', Validators.required],
            sstv: ['1', Validators.required],
            accountCode: ['', Validators.required],
            accountName: ['', Validators.required],
            amount: [
              { value: '', disabled: true },
              [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]
            ],
            accountCategory: ['']
          });
          transactionsArray.push(transaction);
        }

        this.transactionGroups.push(group);
      });

      // 获取科目列表并填充数据
      this.getSubjectList(this.selectedToken.stablecoinId);
    }
  }

  // 修改方法名以更好地反映其功能
  private getDefaultRowCount(type: string): number {
    if (type === 'External  FX Transfer out' || type === 'FX Purchasing -Transfer out') {
      return 3;
    } else if (type === 'Top-Up' || type === 'Withdraw') {
      return 4;
    }
    return 2;
  }

  // 修改方法来决定默认的 Debit/Credit 值
  private getDefaultDebitCredit(type: string, index: number): string {
    // 奇数行(0,2,4...)显示 Debit，偶数行(1,3,5...)显示 Credit
    return index % 2 === 0 ? 'Debit' : 'Credit';
  }

  private getSubjectList(stablecoinId: number) {
    this.http
      .post<SubjectResponse>('/v1/financial/bill/rule/add/subjectList', {
        stablecoinId
      })
      .subscribe({
        next: (response) => {
          if (
            response.code === 0 &&
            response.data &&
            response.data.length > 0
          ) {
            const defaultSubject = response.data[0];

            // 更新所有交易组中的字段
            this.transactionGroups.controls.forEach((group) => {
              const transactionsArray = group.get('transactions') as FormArray;
              transactionsArray.controls.forEach((transaction) => {
                transaction.patchValue({
                  accountCode: defaultSubject.subjectCode,
                  accountName: defaultSubject.subjectTitle,
                  accountCategory: defaultSubject.subjectCategory
                });
              });
            });
          }

          // 保存到会话存储
          const initialData = this.transactionGroups.controls.map((group) => ({
            transactionType: group.get('transactionType')?.value,
            transactions: (group.get('transactions') as FormArray).controls.map(
              (t) => ({
                debitCredit: t.get('debitCredit')?.value,
                financialCategory: t.get('financialCategory')?.value || '1',
                sstv: t.get('sstv')?.value,
                accountCode: t.get('accountCode')?.value,
                accountName: t.get('accountName')?.value,
                accountCategory: t.get('accountCategory')?.value,
                amount: t.get('amount')?.value
              })
            )
          }));
          this.storageService.saveTransactions(initialData);
        },
        error: (error) => {
          console.error('Error getting subject list:', error);
        }
      });
  }

  getTransactions(group: AbstractControl): FormArray {
    return group.get('transactions') as FormArray;
  }

  isFieldInvalid(
    control: AbstractControl,
    fieldName: string,
    groupIndex: number
  ): boolean {
    if (!this.touchedGroups.has(groupIndex) && !this.isFormSubmitted) {
      return false;
    }
    const field = control.get(fieldName);
    return field
      ? field.invalid && (field.dirty || field.touched || this.isFormSubmitted)
      : false;
  }

  getFilteredSubjects(groupIndex: number, transactionIndex: number): any[] {
    const key = `${groupIndex}-${transactionIndex}`;
    return this.currentFilteredSubjects[key] || [];
  }

  onAccountCodeSelect(
    transaction: AbstractControl,
    subject: SubjectInfo,
    groupIndex: number,
    transactionIndex: number
  ) {
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
      debitCredit: [
        lastTransaction.get('debitCredit')?.value || 'Debit',
        Validators.required
      ],
      financialCategory: ['1', Validators.required],
      sstv: [lastTransaction.get('sstv')?.value || '1', Validators.required],
      accountCode: [
        lastTransaction.get('accountCode')?.value || '',
        Validators.required
      ],
      accountName: [
        lastTransaction.get('accountName')?.value || '',
        Validators.required
      ],
      amount: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]
      ],
      accountCategory: [lastTransaction.get('accountCategory')?.value || '']
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

    // 在编辑模式下，如果表单中的 tokenName 为空但 selectedToken 存在，则设置 tokenName
    if (
      this.isEditMode &&
      this.selectedToken &&
      !this.transactionForm.get('tokenName')?.value
    ) {
      this.transactionForm.patchValue({
        tokenName: this.selectedToken
      });
    }

    // Validate all form controls
    Object.keys(this.transactionForm.controls).forEach((key) => {
      const control = this.transactionForm.get(key);
      if (control) {
        control.markAsDirty();
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });

    // Validate all transaction groups
    this.transactionGroups.controls.forEach((group: AbstractControl) => {
      if (group instanceof FormGroup) {
        const transactionsArray = group.get('transactions');
        if (transactionsArray instanceof FormArray) {
          transactionsArray.controls.forEach((transaction: AbstractControl) => {
            if (transaction instanceof FormGroup) {
              Object.keys(transaction.controls).forEach((field) => {
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
      // Get form data
      const formData = {
        ledgerName: this.transactionForm.get('ledgerName')?.value,
        stablecoinId: this.selectedToken?.stablecoinId || 0,
        txBillRuleList: this.transactionGroups.controls.map((group) => {
          const transactionType = group.get('transactionType')?.value;
          // Convert transaction type
          let txType: number;
          switch (transactionType) {
            case 'Top-Up':
              txType = 1;
              break;
            case 'Withdraw':
              txType = 2;
              break;
            case 'Internal Transfer':
              txType = 3;
              break;
            case 'External Transfer Out':
              txType = 4;
              break;
            case 'External Transfer In':
              txType = 5;
              break;
            case 'External FX Transfer Out':
              txType = 6;
              break;
            case 'External FX Transfer In':
              txType = 7;
              break;
            case 'FX Purchasing Transfer Out':
              txType = 8;
              break;
            case 'External Transfer Out':
              txType = 9;
              break;
            default:
              txType = 0;
          }

          return {
            txType,
            loanRuleList: (group.get('transactions') as FormArray).controls.map(
              (transaction) => ({
                amountDesc: this.getAmountPlaceholder(
                  this.transactionGroups.controls.indexOf(group),
                  transaction
                ),
                loanType:
                  transaction.get('debitCredit')?.value === 'Debit' ? 1 : 2,
                financialCategory: transaction.get('financialCategory')?.value,
                sstv: transaction.get('sstv')?.value,
                subjectCategory: transaction.get('accountCategory')?.value,
                subjectCode: transaction.get('accountCode')?.value,
                subjectTitle: transaction.get('accountName')?.value
              })
            )
          };
        })
      };

      // Add ruleId if in edit mode
      if (this.isEditMode && this.ruleId) {
        Object.assign(formData, { ruleId: this.ruleId });
      }

      console.log('Submitting form data:', formData);

      // Call API
      const url = this.isEditMode
        ? '/v1/financial/bill/rule/edit'
        : '/v1/financial/bill/rule/add';
      this.http.post(url, formData).subscribe({
        next: (response: any) => {
          if (response.code === 0) {
            this.message
              .success(
                `${this.isEditMode ? 'Updated' : 'Submitted'} successfully`
              )
              .onClose.subscribe(() => {
                this.router.navigate(['/poc/poc-financial/journal-entries']);
                this.storageService.clearStorage();
              });
          } else {
            this.message.error(
              response.message ||
                `${this.isEditMode ? 'Update' : 'Submit'} failed`
            );
          }
        },
        error: (error) => {
          console.error(
            `Error ${this.isEditMode ? 'updating' : 'submitting'} form:`,
            error
          );
          this.message.error(
            `${
              this.isEditMode ? 'Update' : 'Submit'
            } failed, please try again later`
          );
        }
      });
    } else {
      console.log('Form is invalid:', this.transactionForm);
    }
  }

  private createTransaction() {
    return this.fb.group({
      debitCredit: ['Debit', Validators.required],
      financialCategory: ['1', Validators.required],
      sstv: ['1', Validators.required],
      accountCode: ['', Validators.required],
      accountName: ['', Validators.required],
      amount: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]
      ],
      accountCategory: ['']
    });
  }

  // 搜索过滤方法
  onAccountCodeSearch(
    event: Event,
    groupIndex: number,
    transactionIndex: number
  ): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    const key = `${groupIndex}-${transactionIndex}`;

    if (value) {
      this.loadingSubjects[key] = true;

      // 获取最新的会话存储数据
      const storedSubjects = this.getAllStoredSubjects();

      // 检查是否有新的会话存储数据需要合并
      const newSubjects = storedSubjects.filter(
        (stored) =>
          !this.allSubjects.some(
            (existing) => existing.subjectCode === stored.subjectCode
          )
      );

      if (newSubjects.length > 0) {
        // 有新数据，更新 allSubjects
        this.allSubjects = this.mergeAndDeduplicateSubjects(
          this.allSubjects,
          newSubjects
        );
      }

      // 从已有数据中筛选
      this.currentFilteredSubjects[key] = this.allSubjects.filter(
        (item) =>
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
    storedData.forEach((group) => {
      group.transactions.forEach((transaction) => {
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
  private mergeAndDeduplicateSubjects(
    stored: SubjectInfo[],
    api: SubjectInfo[]
  ): SubjectInfo[] {
    const uniqueSubjects = new Map<string, SubjectInfo>();

    // 先添加存储的科目
    stored.forEach((subject) => {
      uniqueSubjects.set(subject.subjectCode, subject);
    });

    // 再添加API返回的科目，如果有重复会覆盖存储的科目
    api.forEach((subject) => {
      uniqueSubjects.set(subject.subjectCode, subject);
    });

    return Array.from(uniqueSubjects.values());
  }

  // Save single transaction
  onSaveTransaction(
    transaction: AbstractControl,
    groupIndex: number,
    transactionIndex: number
  ) {
    if (!transaction.valid) {
      return;
    }

    const subjectData = {
      stablecoinId: this.selectedToken?.stablecoinId,
      subjectCategory: transaction.get('accountCategory')?.value,
      subjectCode: transaction.get('accountCode')?.value,
      subjectTitle: transaction.get('accountName')?.value
    };

    this.http
      .post('/v1/financial/bill/rule/add/subject/save', subjectData)
      .subscribe({
        next: (response: any) => {
          if (response.code === 0) {
            // Save current state to session storage
            const group = this.transactionGroups.at(groupIndex);
            const currentData: TransactionData = {
              transactionType: group.get('transactionType')?.value,
              transactions: (
                group.get('transactions') as FormArray
              ).controls.map((t) => ({
                debitCredit: t.get('debitCredit')?.value,
                financialCategory: t.get('financialCategory')?.value || '1',
                sstv: t.get('sstv')?.value,
                accountCode: t.get('accountCode')?.value,
                accountName: t.get('accountName')?.value,
                accountCategory: t.get('accountCategory')?.value,
                amount: t.get('amount')?.value
              }))
            };

            this.storageService.updateTransactionGroup(groupIndex, currentData);
            this.message.success('Saved successfully');

            // Check and fill empty fields in all transaction groups
            this.transactionGroups.controls.forEach((g, gIndex) => {
              const transactions = g.get('transactions') as FormArray;

              transactions.controls.forEach((t, tIndex) => {
                // Skip the current transaction if it's in the same group
                if (gIndex === groupIndex && tIndex === transactionIndex) {
                  return;
                }

                const isAccountCodeEmpty = !t.get('accountCode')?.value;
                const isAccountNameEmpty = !t.get('accountName')?.value;
                const isAccountCategoryEmpty = !t.get('accountCategory')?.value;

                if (
                  isAccountCodeEmpty &&
                  isAccountNameEmpty &&
                  isAccountCategoryEmpty
                ) {
                  // Fill with saved data if all fields are empty
                  t.patchValue({
                    accountCode: transaction.get('accountCode')?.value,
                    accountName: transaction.get('accountName')?.value,
                    accountCategory: transaction.get('accountCategory')?.value
                  });
                }
              });
            });
          }
        },
        error: (error) => {
          console.error('Error saving subject:', error);
        }
      });
  }

  // 删除记录
  removeTransaction(groupIndex: number, transactionIndex: number) {
    const group = this.transactionGroups.at(groupIndex);
    const transactions = group.get('transactions') as FormArray;
    const transactionType = group.get('transactionType')?.value;

    // 根据交易类型判断最小行数
    const minRows =
      transactionType === 'Transfer' || transactionType === 'FX Purchasing'
        ? 3
        : 2;

    if (transactions.length > minRows) {
      transactions.removeAt(transactionIndex);
      this.storageService.deleteTransaction(groupIndex, transactionIndex);
      this.message.success('Deleted successfully');
    }
  }

  // 加载存储的数据
  private loadStoredData() {
    const storedData = this.storageService.getTransactions();
    if (storedData && storedData.length > 0) {
      storedData.forEach((groupData: TransactionData) => {
        const group = this.fb.group({
          transactionType: [groupData.transactionType, Validators.required],
          transactions: this.fb.array([])
        });

        const transactionsArray = group.get('transactions') as FormArray;
        if (groupData.transactions && groupData.transactions.length > 0) {
          groupData.transactions.forEach((transaction: Transaction, index) => {
            transactionsArray.push(
              this.fb.group({
                debitCredit: [
                  transaction.debitCredit || this.getDefaultDebitCredit(groupData.transactionType, index),
                  Validators.required
                ],
                financialCategory: [transaction.financialCategory || '1', Validators.required],
                sstv: [transaction.sstv || '1', Validators.required],
                accountCode: [transaction.accountCode, Validators.required],
                accountName: [transaction.accountName, Validators.required],
                amount: [
                  { value: transaction.amount, disabled: true },
                  [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]
                ],
                accountCategory: [transaction.accountCategory]
              })
            );
          });
        } else {
          // 如果没有交易记录，添加默认行数的空记录
          const defaultRows = this.getDefaultRowCount(groupData.transactionType);
          for (let i = 0; i < defaultRows; i++) {
            transactionsArray.push(
              this.fb.group({
                debitCredit: [this.getDefaultDebitCredit(groupData.transactionType, i), Validators.required],
                financialCategory: ['1', Validators.required],
                sstv: ['1', Validators.required],
                accountCode: ['', Validators.required],
                accountName: ['', Validators.required],
                amount: [
                  { value: '', disabled: true },
                  [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]
                ],
                accountCategory: ['']
              })
            );
          }
        }

        this.transactionGroups.push(group);
      });
    } else {
      // 如果没有存储的数据，创建默认的交易组
      this.transactionTypes.forEach((type) => {
        const group = this.fb.group({
          transactionType: [type, Validators.required],
          transactions: this.fb.array([])
        });

        const transactionsArray = group.get('transactions') as FormArray;
        const defaultRows = this.getDefaultRowCount(type);
        for (let i = 0; i < defaultRows; i++) {
          transactionsArray.push(
            this.fb.group({
              debitCredit: [this.getDefaultDebitCredit(type, i), Validators.required],
              financialCategory: ['1', Validators.required],
              sstv: ['1', Validators.required],
              accountCode: ['', Validators.required],
              accountName: ['', Validators.required],
              amount: [
                { value: '', disabled: true },
                [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]
              ],
              accountCategory: ['']
            })
          );
        }

        this.transactionGroups.push(group);
      });
    }
  }

  // 修改判断是否显示删除按钮的方法
  canShowDeleteButton(groupIndex: number, transactionIndex: number): boolean {
    const group = this.transactionGroups.at(groupIndex);
    const transactionType = group.get('transactionType')?.value;
    const defaultRows = this.getDefaultRowCount(transactionType);
    return transactionIndex >= defaultRows;
  }

  // 修改 getAmountPlaceholder 方法
  getAmountPlaceholder(
    groupIndex: number,
    transaction: AbstractControl
  ): string {
    const group = this.transactionGroups.at(groupIndex);
    const transactionType = group.get('transactionType')?.value;
    const debitCredit = transaction.get('debitCredit')?.value;
    const transactions = group.get('transactions') as FormArray;
    const index = transactions.controls.indexOf(transaction);

    if (transactionType === 'External  FX Transfer out' || transactionType === 'FX Purchasing -Transfer out') {
      if (index === 2) {
        return `${transactionType} Fee Amount`;
      }
      return `${transactionType} Amount - ${debitCredit === 'Debit' ? 'From' : 'To'}`;
    } else if (transactionType === 'Top-Up' || transactionType === 'Withdraw') {
      if (index === 3) {
        return `${transactionType} Fee Amount`;
      }
      return `${transactionType} Amount - ${debitCredit === 'Debit' ? 'From' : 'To'}`;
    }

    return `${transactionType} Amount`;
  }

  // 添加监听 debit/credit 变化的方法
  onDebitCreditChange(transaction: AbstractControl, groupIndex: number) {
    // 触发重新渲染 amount placeholder
    transaction.get('amount')?.updateValueAndValidity();
  }

  // ... 其他已有的方法 ...
}
