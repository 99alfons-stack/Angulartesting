import { Injectable, signal, computed } from '@angular/core';
import { TodoItem, TodoCategory } from './todo.model';

const STORAGE_KEY = 'todo-app-items';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly _items = signal<TodoItem[]>(this.loadFromStorage());

  readonly items = this._items.asReadonly();

  readonly pendingCount = computed(
    () => this._items().filter(i => !i.completed).length
  );

  add(
    title: string,
    category: TodoCategory,
    dueDate: string,
    dueTime: string
  ): void {
    const item: TodoItem = {
      id: crypto.randomUUID(),
      title: title.trim(),
      category,
      dueDate,
      dueTime,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    this._items.update(items => [...items, item]);
    this.saveToStorage();
  }

  toggle(id: string): void {
    this._items.update(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
    this.saveToStorage();
  }

  remove(id: string): void {
    this._items.update(items => items.filter(item => item.id !== id));
    this.saveToStorage();
  }

  private loadFromStorage(): TodoItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as TodoItem[]) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
    } catch {
      // ignore storage errors (e.g. private browsing quota)
    }
  }
}
