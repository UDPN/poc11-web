import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { fnCheckForm } from '@app/utils/tools';
import { finalize } from 'rxjs';
import { UserService } from '@app/core/services/http/poc-system/user/user.service';

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
  info: any = {};
  isLoading: boolean = false;
  tempStatus: boolean = true;
  roleList: any = [];
  detailRoleList: any = [];
  userId: any = '';
  constructor(private fb: FormBuilder, public routeInfo: ActivatedRoute, private message: NzMessageService, private userService: UserService, private cdr: ChangeDetectorRef, private location: Location) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: this.tempStatus === true ? 'Create' : 'Edit',
      breadcrumbs: [
        { name: 'System Management' },
        { name: 'User Management', url: '/poc/poc-system/user' },
        { name: this.tempStatus === true ? 'Create' : 'Edit' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit() {   
    this.getRoleList();
    this.routeInfo.queryParams.subscribe((params: any) => {
      if (JSON.stringify(params) !== '{}') {
        this.tempStatus = false;
        this.getInfo(params['userId']);
      }
    })
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required, this.nameValidator]],
      realName: [null, [Validators.required, this.realNameValidator]],
      telephone: [null, [Validators.required]],
      email: [null, [Validators.required, this.emailValidator]],
      roleIdList: [null, [Validators.required]],
      lockable: [2, [Validators.required]],
    })
  }

  nameValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!(/^[A-Za-z0-9]{2,20}$/).test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  realNameValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!(/^.{2,20}$/).test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  emailValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!(/^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/).test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };


  getRoleList() {
    this.userService.roleList().subscribe(data => {
      this.roleList = data;
      const array: any[] = [];
      this.roleList.map((item: any) => {
        array.push({
          value: item.roleId,
          label: item.roleName
        })
      })
      this.roleList = array;
    });
  }

  getInfo(userId: string): void {
    this.userService.info({ userId }).subscribe((res: any) => {
      this.info = res;
      this.userId = userId;
      this.detailRoleList = res.roleList;
      const array: any[] = [];
      this.detailRoleList.map((item: any) => {
        array.push(item.roleId)
      })
      this.detailRoleList = array;
      this.validateForm.get('userName')?.setValue(res.userName);
      this.validateForm.get('realName')?.setValue(res.realName);
      this.validateForm.get('telephone')?.setValue(res.telephone);
      this.validateForm.get('email')?.setValue(res.email);
      this.validateForm.get('roleIdList')?.setValue(this.detailRoleList);
      this.validateForm.get('lockable')?.setValue(res.lockable);
      this.cdr.markForCheck();
      return;
    })
  }

  onSubmit() {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    this.isLoading = true;
    if (this.tempStatus === true) {
      this.userService.add(this.validateForm.value).pipe(finalize(() => this.isLoading = false)).subscribe({
        next: res => {
          if (res) {
            this.message.success('Add successfully!',{ nzDuration: 1000}).onClose.subscribe(() => {
              this.validateForm.reset();
              this.location.back();
            });
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: err => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      })
    } else {
      const param = {
        userName: this.validateForm.get('userName')?.value,
        realName: this.validateForm.get('realName')?.value,
        telephone: this.validateForm.get('telephone')?.value,
        email: this.validateForm.get('email')?.value,
        roleIdList: this.validateForm.get('roleIdList')?.value,
        lockable: this.validateForm.get('lockable')?.value,
        userId: this.userId
      }
      this.userService.edit(param).pipe(finalize(() => this.isLoading = false)).subscribe({
        next: res => {
          if (res) {
            this.message.success('Edit successfully!',{ nzDuration: 1000}).onClose.subscribe(() => {
              this.validateForm.reset();
              this.location.back();
            });
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: err => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      })
    }

  }

  onBack() {
    this.location.back();
  }

}
