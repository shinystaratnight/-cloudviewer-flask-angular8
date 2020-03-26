import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { trigger } from '@angular/animations';
import { createElementCssSelector } from '@angular/compiler';

export enum FlexibleDialogElement_Type {
  IPAddress,
  textbox,
  checkbox,
  dropdown,
}

export enum FlexibleDialog_ChangeType {
  Add,
  Edit,
  Delete,
}

export class FlexibleDialogStructure {
  Title: string;
  AddTitle = 'Add';
  EditTitle = 'Edit';
  DeleteTitle = 'Delete';
  ChangeType: FlexibleDialog_ChangeType;
  AdditionalSubmitData: FlexibleDialogElement_NVP[] | undefined;
  SubmitTitle = 'Submit';
  SubmitTitleColor = 'primary';
  CancelTitle = 'Cancel';
  CancelTitleColor = 'accent';
  ShowRemove = false
  RemoveTitle = 'Delete';
  RemoveTitleColor = 'red';
}

export class FlexibleDialogElement {
  DisplayName: string;
  Type: FlexibleDialogElement_Type;
  FormName: string = 'Form';
  DataName: string;
  Placeholder: string;
  Display = true;
  ValidatorsRequired: boolean | undefined;
  ValidatorsMinLength: number | undefined;
  ValidatorsMaxLength: number | undefined;
  // ------- ONLY FOR CHECKBOX
  Checked: boolean;
  // ------- ONLY FOR DROPDOWN
  Options: FlexibleDialogElement_NVP[] | undefined;
  Defualt: FlexibleDialogElement_NVP | undefined;
}

// tslint:disable-next-line: class-name
export class FlexibleDialogElement_NVP {
  Name: string;
  Value: string | number | boolean;

  constructor(Name?: string, Value?: string | number | boolean) {
    this.Name = Name;
    this.Value = Value;
  }
}

// tslint:disable-next-line: class-name
export class FlexibleDialogElement_NVP_ObjtoArr {

  public EscapeString = '_escaped_';
  public arrReservedWords = ['name'];

  // Save Escaped Fields
  private arrEscaped: string[] = Array();


  // factory for "object" conversion
  Build(obj: any): FlexibleDialogElement_NVP[] {
    const arr: FlexibleDialogElement_NVP[] = Array();

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        let EscapedKey = key;
        if (this.arrReservedWords.filter(data => data === key).length > 0) {
          EscapedKey = `${this.EscapeString}${key}`; // escape this element
        }
        const NVP = new FlexibleDialogElement_NVP(EscapedKey, obj[key]);
        arr.push(NVP);

      }
    }

    return arr;
  }

  // Escape Form name for reserved words
  EscapeElements(arr: FlexibleDialogElement[]): FlexibleDialogElement[] {
    arr.map(obj => {
      if (this.arrReservedWords.filter(data => data === obj.FormName).length > 0) {
        this.arrEscaped.push(obj.FormName);
        obj.FormName = `${this.EscapeString}${obj.FormName}`; // escape this Form Name
      }
      return obj;
    });

    return arr;
  }

  // Escape Form name for reserved words
  EscapeData(arr: FlexibleDialogData[]): FlexibleDialogData[] {
    arr.map(obj => {
      if (this.arrReservedWords.filter(data => data === obj.Name).length > 0) {
        obj.Name = `${this.EscapeString}${obj.Name}`; // escape this Form Name
      }
      return obj;
    });

    return arr;
  }


  // factory for "object" conversion
  Unescape(obj: any): any {

    this.arrEscaped.forEach(name => {
      obj[name] = obj[`${this.EscapeString}${name}`];
      delete obj[`${this.EscapeString}${name}`];
    });

    return obj;
  }
}



export class FlexibleDialogData {
  Name: string;
  Value: string | number | boolean;

  constructor(Name?: string, Value?: string | number | boolean) {
    this.Name = Name;
    this.Value = Value;
  }
}


@Component({
  selector: 'app-flexible-dialog',
  templateUrl: './flexible-dialog.component.html',
  styleUrls: ['./flexible-dialog.component.css']
})
export class FlexibleDialogComponent implements OnInit {

  // add LiveData function
  public LiveData = '';

  // setup form
  private controlsConfig = new Object();
  public form: FormGroup;
  public ChangeTitle: string;

  // internal data structure
  public structure: FlexibleDialogStructure;
  public elements: FlexibleDialogElement[];
  public datas: FlexibleDialogData[];

  // dialog functions
  public afterClosed: Observable<any>;
  private formBuilder: FormBuilder = new FormBuilder();

  // Save IP Address Fields
  private arrIPs: string[] = Array();

  // To save escaped keywords
  private flexibleDialogElement_NVP_ObjtoArr = new FlexibleDialogElement_NVP_ObjtoArr();

  constructor(
    public dialogRef: MatDialogRef<FlexibleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: object,
    // @Inject(MAT_DIALOG_DATA) private liveData: object,
  ) {

    this.structure = data['structure'];

    // set Title
    if (this.structure.ChangeType === FlexibleDialog_ChangeType.Add) {
      this.ChangeTitle = this.structure.AddTitle;
    } else if (this.structure.ChangeType === FlexibleDialog_ChangeType.Edit) {
      this.ChangeTitle = this.structure.EditTitle;
    } else if (this.structure.ChangeType === FlexibleDialog_ChangeType.Delete) {
      this.ChangeTitle = this.structure.DeleteTitle;
    }

    // add save action
    this.controlsConfig['action'] = 'save';

    // Escape Control Names
    this.elements = this.flexibleDialogElement_NVP_ObjtoArr.EscapeElements(data['elements']);
    this.datas = this.flexibleDialogElement_NVP_ObjtoArr.EscapeData(data['datas']);

    // Check for IP addresses
    const elements_Expanded = this.ExpandIPs(this.elements);

    // Parse FlexibleDialogElements
    elements_Expanded.forEach((value, num, arr) => this.ParseFlexibleDialogElement(value, num, arr));

    // set form controls to form group
    this.form = this.formBuilder.group(this.controlsConfig);

  }

  ExpandIPs(elements: FlexibleDialogElement[]): FlexibleDialogElement[] {
    const ret: FlexibleDialogElement[] = Array();

    elements.forEach(ele => {
      if (ele.Type === FlexibleDialogElement_Type.IPAddress) {

        // Elements
        const FormName = ele.FormName;

        this.arrIPs.push(FormName);

        ele = Object.assign({}, ele);
        ele.FormName = `${FormName}_0`;
        ret.push(ele);

        ele = Object.assign({}, ele);
        ele.FormName = `${FormName}_1`;
        ret.push(ele);

        ele = Object.assign({}, ele);
        ele.FormName = `${FormName}_2`;
        ret.push(ele);

        ele = Object.assign({}, ele);
        ele.FormName = `${FormName}_3`;
        ret.push(ele);

        // Data
        let data = this.datas.filter(data => data.Name === ele.DataName)

        // Zero Length, assume DataName wasn't set
        if (data.length === 0) {
          data = this.datas.filter(data => data.Name === FormName)
        }

        if (data.length === 0) {
          // For new records, no data will be set
          // throw new Error(`ParseFlexibleDialogElement: Error Parsing IP address '${ele.DataName}'`);
        } else {
          let IP: string = data[0].Value as string;
          let arrIP = ['', '', '', ''];
          
          if (IP === null) {
            IP = '0.0.0.0';
          }
          if (IP !== undefined && IP.indexOf('.')) {
            arrIP = IP.split('.');
            this.datas.push(new FlexibleDialogData(`${FormName}_0`, arrIP[0]));
            this.datas.push(new FlexibleDialogData(`${FormName}_1`, arrIP[1]));
            this.datas.push(new FlexibleDialogData(`${FormName}_2`, arrIP[2]));
            this.datas.push(new FlexibleDialogData(`${FormName}_3`, arrIP[3]));
          } else {
            
            throw new Error(`ParseFlexibleDialogElement: Error Parsing IP address '${IP}'`);
          }
        }

      } else {
        ret.push(ele);
      }
    });

    return ret;

  }


  ngOnInit() {
    this.form.valueChanges
      .subscribe(data => this.CheckDirtyOnClickOff());
  }


  submit(form: FormGroup) {
    let result = new Object();
    const factory = new FlexibleDialogElement_NVP_ObjtoArr();

    // Unescape Control Names
    const UnescapeControls = this.flexibleDialogElement_NVP_ObjtoArr.Unescape(form.controls);

    for (const control in UnescapeControls) {
      if (UnescapeControls.hasOwnProperty(control)) {
        result[control] = UnescapeControls[control].value;
      }
    }

    // Colapse IP Addresses
    result = this.CollapseIPs(result);

    // Add Additional submit data
    if (this.structure.AdditionalSubmitData !== undefined) {
      this.structure.AdditionalSubmitData.forEach(data => {
        result[data.Name] = data.Value;
      });
    }

    this.dialogRef.close(result);
  }

  CollapseIPs(objControls: Object): Object {

    this.arrIPs.forEach(FormName => {
      // create new element
      // tslint:disable-next-line: max-line-length
      objControls[FormName] = objControls[`${FormName}_0`] + '.' + objControls[`${FormName}_1`] + '.' + objControls[`${FormName}_2`] + '.' + objControls[`${FormName}_3`];

      // delete others
      delete objControls[`${FormName}_0`];
      delete objControls[`${FormName}_1`];
      delete objControls[`${FormName}_2`];
      delete objControls[`${FormName}_3`];
    });

    return objControls;
  }

  remove(form: FormGroup) {
    const result = new Object();

    for (let control in form.controls) {
      if (control === 'action') {
        form.controls[control].setValue("delete");
      }
    }

    this.dialogRef.close(false);
  }

  close() {
    const result = new Object();
    result['action'] = 'close';

    this.dialogRef.disableClose = false
    this.dialogRef.close();
  }

  // UTILITY

  CheckDirtyOnClickOff() {
    if (this.form.dirty) {
      this.dialogRef.disableClose = true;
      return false;
    } else {
      this.dialogRef.disableClose = false;
      return true;
    }
  }

  ParseFlexibleDialogElement(value: any, num: number, arr: any[]) {

    const element: FlexibleDialogElement = value;

    let arrControl: any[];

    // resevered word used as Element.FormName
    if (element.FormName === 'name') {
      
      throw new Error(`ParseFlexibleDialogElement: Resevered word '${element.FormName}' used as Element Name (FormName)`);
    }

    // Fill Ins for easy use
    if (element.DataName === undefined) {
      element.DataName = element.FormName;
    }

    if (element.Placeholder === undefined) {
      element.Placeholder = element.DisplayName;
    }

    // set data if there is data set
    const DataVal = this.datas.filter(data => (data.Name === element.DataName));

    if (element.Type === FlexibleDialogElement_Type.checkbox) {

      if (DataVal[0] !== undefined) {
        arrControl = [true];
      } else {
        arrControl = [false];
      }

    } else {
      if (DataVal[0] !== undefined) {
        arrControl = [DataVal[0].Value];
      } else {
        arrControl = [''];
      }
    }

    // Validators
    if (element.ValidatorsRequired !== undefined) {
      arrControl.push(Validators.required);
    }

    if (element.ValidatorsMinLength !== undefined) {
      arrControl.push(Validators.minLength(element.ValidatorsMinLength));
    }

    if (element.ValidatorsMaxLength !== undefined) {
      arrControl.push(Validators.maxLength(element.ValidatorsMaxLength));
    }

    // IP Validation
    if (element.Type === FlexibleDialogElement_Type.IPAddress) {
      arrControl.push(Validators.pattern('(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)'));
    }

    // save the control
    this.controlsConfig[element.FormName] = arrControl;
  }

  // tslint:disable-next-line: variable-name
  isTextbox(flexibleDialogElement_Type: FlexibleDialogElement_Type) {
    return (flexibleDialogElement_Type === FlexibleDialogElement_Type.textbox);
  }

  // tslint:disable-next-line: variable-name
  isCheckbox(flexibleDialogElement_Type: FlexibleDialogElement_Type) {
    return (flexibleDialogElement_Type === FlexibleDialogElement_Type.checkbox);
  }

  // tslint:disable-next-line: variable-name
  isDropdown(flexibleDialogElement_Type: FlexibleDialogElement_Type) {
    return (flexibleDialogElement_Type === FlexibleDialogElement_Type.dropdown);
  }

  // tslint:disable-next-line: variable-name
  isIPAddress(flexibleDialogElement_Type: FlexibleDialogElement_Type) {
    return (flexibleDialogElement_Type === FlexibleDialogElement_Type.IPAddress);
  }

}