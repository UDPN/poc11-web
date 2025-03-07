import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/core/services/http/common/common.service';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Location } from '@angular/common';
import { el } from 'date-fns/locale';
import { CbdcWalletService } from '@app/core/services/http/poc-wallet/cbdc-wallet/cbdc-wallet.service';
import { finalize } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { fnCheckForm, isJSON } from '@app/utils/tools';
import { MetaMaskService } from '@app/core/services/common/metaMask.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  validateForm!: FormGroup;
  centralBankList: any[] = [];
  walletAddressList: any[] = [];
  isLoading: boolean = false;
  walletAddressListLength: any = '';
  showKeyStore: boolean = false;
  orginalWalletAddressList: any = [];
  fileText: any = '';
  fileTextWord: any = '';
  fileTextName: any = '';
  fileStatus: number = 1;
  metaArrStr: string[] = [];
  metaArrStrSignPass: string[] = [];
  addAddressArr: string[] = [];
  testStatus = false;
  messageTip: any = `For the first wallet created with the home Custodian Bank, it is referred to as the "Master Wallet". Subsequent wallets are labeled as "Sub-wallet". 
  For the first wallet created with the foreign Custodian Bank, it is referred to as the "Main Wallet". Subsequent wallets are labeled as "Sub-wallet".`;
  creationMethodTip: string =
    'The system will generate a wallet address and an associated private key. The private key will be automatically created and hosted within the sandbox system.';
  public metaArr$ = this.metaMaskService.MetaArray$;

  constructor(
    public routeInfo: ActivatedRoute,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private location: Location,
    private cbdcWalletService: CbdcWalletService,
    private message: NzMessageService,

    private metaMaskService: MetaMaskService
  ) {}

  ngAfterViewInit(): void {
    this.creationMethodChanges();
    this.centralBankChanges();
    this.walletAddressChanges();
    this.pageHeaderInfo = {
      title: `Create`,
      breadcrumbs: [
        {
          name: 'Wallet Management'
        },
        {
          name: 'Wallet Management',
          url: '/poc/poc-wallet/cbdc-wallet'
        },
        { name: 'Create' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  creationMethodChanges() {
    this.validateForm
      .get('creationMethod')
      ?.valueChanges.subscribe((item: number) => {
        this.validateForm.get('centralBankId')?.reset('');
        this.validateForm.get('currency')?.reset('');
        if (item === 1) {
          this.validateForm.addControl(
            'walletAddress',
            this.fb.control('', [Validators.required])
          );
          this.creationMethodTip =
            'You can create the wallet and manage the private key via the MetaMask plugin in the browser. If you have not installed the plugin, please do so first.';
          this.getWalletAddress();
        } else {
          this.validateForm.removeControl('walletAddress');
          this.creationMethodTip =
            'The system will generate a wallet address and an associated private key. The private key will be automatically created and hosted within the sandbox system.';
        }
      });
  }

  centralBankChanges() {
    this.validateForm
      .get('centralBankId')
      ?.valueChanges.subscribe((value: number) => {
        this.validateForm.get('walletAddress')?.reset('');
        this.centralBankList.forEach((item) => {
          if (value === item.centralBankId) {
            this.getWalletAddress(item.centralBankId);
            this.validateForm.get('currency')?.setValue(item.digitalSymbol);
          }
        });
      });
  }

  walletAddressChanges() {
    this.validateForm
      .get('walletAddress')
      ?.valueChanges.subscribe((value: string) => {
        this.onSelectWalletAddress(value);
      });
  }

  ngOnInit() {
    this.metaMaskService.clearMetaArray$();
    this.getCentralBank();
    this.getBnNode();
    this.validateForm = this.fb.group({
      creationMethod: [0, [Validators.required]],
      centralBankId: ['', [Validators.required]],
      // currency: ['', [Validators.required]],
      bnCode: [null, [Validators.required]]
    });
  }

  uploadFileSig($event: NzSafeAny) {
    const fielSize = $event.target.files[0]?.size! / 1000 > 50;
    if (fielSize && $event.target.files[0] !== undefined) {
      this.message.error('The file size cannot exceed 50KB');
    }
    if ($event.target.files[0].name.indexOf('.json') === -1) {
      this.message.error('Please upload the keystore file in JSON format !');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL($event.target.files[0]);
    reader.onload = () => {
      this.fileText = reader.result;
      this.fileTextWord = $event.target.files[0];
      this.fileTextName = $event.target.files[0].name;
      this.cdr.markForCheck();
      this.validateForm.get('file')?.setValue(this.fileText);
      if (this.validateForm.get('file')?.value !== '') {
        this.fileStatus = 2;
      } else {
        this.fileStatus = 1;
      }
    };
  }

  onDeleteFile(): void {
    let ss: any = window.document.getElementById('files')!;
    ss.value = '';
    this.fileStatus = 1;
    this.validateForm.get('file')?.setValue('');
    this.fileTextName = '';
  }

  getCentralBank() {
    this.cbdcWalletService.getCentralBankAdd().subscribe((res) => {
      this.centralBankList = res;
    });
  }

  getBnNode() {
    this.cbdcWalletService.getBnNode().subscribe((res) => {
      if (res) {
        this.validateForm.get('bnCode')?.setValue(res);
      }
    });
  }

  getWalletAddress(centralBankId?: any) {
    this.cbdcWalletService
      .getWalletAddress({ centralBankId })
      .subscribe((res) => {
        if (res) {
          this.orginalWalletAddressList = res;
          this.walletAddressList = res;
          this.walletAddressListLength = this.walletAddressList.length;
        }
      });
  }

  onSelectWalletAddress(event: NzSafeAny) {
    if (this.metaArrStr.includes(event)) {
      if (this.metaArrStrSignPass.includes(event)) {
        this.testStatus = true;
      } else {
        this.testStatus = false;
      }
    } else {
      this.testStatus = false;
    }
    if (
      this.orginalWalletAddressList.indexOf(event) !== -1 ||
      this.metaArrStr.includes(event) ||
      !this.addAddressArr.includes(event)
    ) {
      this.showKeyStore = false;
      this.walletAddressList = this.orginalWalletAddressList;
      this.validateForm.removeControl('keyStorePassword');
      this.validateForm.removeControl('verifyKeyStorePassword');
      this.validateForm.removeControl('file');
    } else {
      this.showKeyStore = true;
      this.validateForm.addControl(
        'keyStorePassword',
        this.fb.control('', [Validators.required])
      );
      this.validateForm.addControl(
        'verifyKeyStorePassword',
        this.fb.control('', [Validators.required, this.verifyKeyValidator])
      );
      this.validateForm.addControl(
        'file',
        this.fb.control('', [Validators.required])
      );
    }
  }
  verifyKeyValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (
      control.value !== this.validateForm.controls['keyStorePassword'].value
    ) {
      return { regular: true, error: true };
    }
    return {};
  };
  addItem(input: HTMLInputElement): void {
    const value = input.value;
    if (value === '') {
      return;
    }
    this.addAddressArr.push(input.value);
    Array.from(new Set(this.addAddressArr));

    if (this.walletAddressList.indexOf(value) === -1) {
      if (this.walletAddressList.length > this.walletAddressListLength) {
        this.walletAddressList[this.walletAddressListLength] = input.value;
        this.validateForm.get('walletAddress')?.setValue(input.value);
      } else {
        this.walletAddressList = [...this.walletAddressList, input.value];
        this.validateForm.get('walletAddress')?.setValue(input.value);
      }
      this.showKeyStore = true;
    }
  }

  onSubmit() {
    this.isLoading = true;
    const params = {
      bankWalletAddReqVO: this.showKeyStore
        ? {
            bnCode: this.validateForm.value.bnCode,
            centralBankId: this.validateForm.value.centralBankId,
            creationMethod: this.validateForm.value.creationMethod,
            walletAddress: this.validateForm.value.walletAddress,
            keyStorePassword: this.validateForm.value.keyStorePassword,
            verifyKeyStorePassword:
              this.validateForm.value.verifyKeyStorePassword
          }
        : {
            bnCode: this.validateForm.value.bnCode,
            centralBankId: this.validateForm.value.centralBankId,
            creationMethod: this.validateForm.value.creationMethod,
            walletAddress: this.validateForm.value.walletAddress
          },
      file: this.fileTextWord
    };
    this.cbdcWalletService
      .save(params)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          if (res) {
            this.message
              .success('Wallet added!', { nzDuration: 1000 })
              .onClose.subscribe(() => {
                this.validateForm.reset();
                this.location.back();
              });
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  onBack() {
    this.location.back();
  }
  async onMetaMask() {
    this.metaArrStr = [];
    let accounts: string[] = await this.metaMaskService.checkMeataMask();
    this.metaArrStr = accounts;
    this.validateForm.get('walletAddress')?.setValue(accounts[0]);
    // if (accounts.length > 0) {
    //   this.validateForm.get('walletAddress')?.setValue(accounts[0]);
    //   if(this.walletAddressList.indexOf(accounts[0]) === -1){
    //      this.showKeyStore = true;
    //   }else{
    //     this.showKeyStore = false;
    //   }
    // }
  }
  onSign() {
    // this.cbdcWalletService
    //   .getSign({ account: this.validateForm.get('walletAddress')?.value })
    //   .subscribe((res) => {
    // signData
    let result = this.metaMaskService.sign(
      this.validateForm.get('walletAddress')?.value,
      '0x74821001be5de68857fac04ad24074d264c5b1d7024cae7dec3f4415592d65b8'
    );
    result.then((ress) => {
      if (typeof ress === 'undefined') {
        return;
      }
      if (ress !== '') {
        this.testStatus = true;
        this.metaArrStrSignPass.push(
          this.validateForm.get('walletAddress')?.value
        );
        this.message.success('Signature successful!');
        this.cdr.markForCheck();
      }
    });
    // });
  }
}
