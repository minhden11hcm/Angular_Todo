import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListService } from '../list.service';
import { ItTask } from '../Model/task';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  constructor(private fb: FormBuilder, private list: ListService) {}

  public todoForm!: FormGroup;
  public tasks: ItTask[] = this.list.getTasks();
  public inprogress: ItTask[] = this.list.getInprogress();
  public done: ItTask[] = this.list.getDone();
  public isEditable: boolean = false;
  public updateID!: any;
  public KEYS = this.list.getKEYS();

  addTask(): void {
    this.list.addTask({ description: this.todoForm.value.item, done: false });
    this.todoForm.reset();
  }

  onEdit(item: ItTask, index: number): void {
    this.list.onEdit(item, index, this.todoForm);
    this.isEditable = this.list.getIsEditable();
  }

  updateTask() {
    this.list.updateTask(this.todoForm);
    this.isEditable = this.list.getIsEditable();
    this.updateID = this.list.getUpdateID();
  }

  //handle delete task
  deleteTask(index: number): void {
    this.list.deleteTask(index);
  }

  deleteInprogress(index: number): void {
    this.list.deleteInprogress(index);
  }

  deleteDone(index: number): void {
    this.list.deleteDone(index);
  }

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      item: ['', Validators.required],
    });
  }
  drop(event: CdkDragDrop<ItTask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      let id = event.container.id;
      let data = event.container.data;
      console.log(event.previousContainer);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      if (id === 'cdk-drop-list-0') {
        this.list.setDataLocal(this.KEYS.TASKS_STORAGE_KEY, data);
        if (event.previousContainer.id === 'cdk-drop-list-1') {
          this.list.setDataLocal(
            this.KEYS.INPROGRESS_STORAGE_KEY,
            event.previousContainer.data
          );
        } else if (event.previousContainer.id === 'cdk-droplist-2') {
          this.list.setDataLocal(
            this.KEYS.DONE_STORAGE_KEY,
            event.previousContainer.data
          );
        }
      } else if (id === 'cdk-drop-list-1') {
        console.log('list 1');
        this.list.setDataLocal(this.KEYS.INPROGRESS_STORAGE_KEY, data);
        if (event.previousContainer.id === 'cdk-drop-list-0') {
          this.list.setDataLocal(
            this.KEYS.TASKS_STORAGE_KEY,
            event.previousContainer.data
          );
        } else if (event.previousContainer.id === 'cdk-drop-list-2') {
          console.log('ok');
          this.list.setDataLocal(
            this.KEYS.DONE_STORAGE_KEY,
            event.previousContainer.data
          );
        }
      } else if (id === 'cdk-drop-list-2') {
        this.list.setDataLocal(this.KEYS.DONE_STORAGE_KEY, data);
        if (event.previousContainer.id === 'cdk-drop-list-1') {
          this.list.setDataLocal(
            this.KEYS.INPROGRESS_STORAGE_KEY,
            event.previousContainer.data
          );
        } else if (event.previousContainer.id === 'cdk-drop-list-0') {
          this.list.setDataLocal(
            this.KEYS.TASKS_STORAGE_KEY,
            event.previousContainer.data
          );
        }
      }
    }
  }
}
