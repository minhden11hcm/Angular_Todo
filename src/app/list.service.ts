import { Injectable } from '@angular/core';
import { ItTask } from './Model/task';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private KEYS = {
    TASKS_STORAGE_KEY: 'TASKS',
    INPROGRESS_STORAGE_KEY: 'INPROGRESS',
    DONE_STORAGE_KEY: 'DONE',
  };
  private tasks: ItTask[] = this.getLocalData(this.KEYS.TASKS_STORAGE_KEY);
  private inprogress: ItTask[] = this.getLocalData(
    this.KEYS.INPROGRESS_STORAGE_KEY
  );
  private done: ItTask[] = this.getLocalData(this.KEYS.DONE_STORAGE_KEY);
  private updateID!: any;
  private isEditable: boolean = false;

  // get, set localStorage
  getLocalData(key: string): ItTask[] {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  setDataLocal(key: string, list: ItTask[]): void {
    return localStorage.setItem(key, JSON.stringify(list));
  }

  //get data
  getTasks(): ItTask[] {
    return this.tasks;
  }
  getInprogress(): ItTask[] {
    return this.inprogress;
  }

  getDone(): ItTask[] {
    return this.done;
  }

  getIsEditable(): boolean {
    return this.isEditable;
  }

  getUpdateID() {
    return this.updateID;
  }

  getKEYS() {
    return this.KEYS;
  }

  //handle

  addTask(task: ItTask): void {
    this.tasks.push(task);
    this.setDataLocal(this.KEYS.TASKS_STORAGE_KEY, this.tasks);
  }

  onEdit(item: ItTask, index: number, todoForm: FormGroup): void {
    todoForm.controls['item'].setValue(item.description);
    this.updateID = index;
    this.isEditable = true;
  }

  updateTask(todoForm: FormGroup): void {
    this.tasks[this.updateID].description = todoForm.value.item;
    this.tasks[this.updateID].done = false;
    this.setDataLocal(this.KEYS.TASKS_STORAGE_KEY, this.tasks);
    todoForm.reset();
    this.updateID = undefined;
    this.isEditable = false;
  }

  deleteTask(index: number): void {
    this.tasks.splice(index, 1);
    this.setDataLocal(this.KEYS.TASKS_STORAGE_KEY, this.tasks);
  }

  deleteInprogress(index: number): void {
    this.inprogress.splice(index, 1);
    this.setDataLocal(this.KEYS.INPROGRESS_STORAGE_KEY, this.tasks);
  }

  deleteDone(index: number): void {
    this.done.splice(index, 1);
    this.setDataLocal(this.KEYS.DONE_STORAGE_KEY, this.tasks);
  }

  constructor() {}
}
