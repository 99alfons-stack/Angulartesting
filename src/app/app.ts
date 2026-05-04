import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from './todo.service';
import {
  TodoCategory,
  TodoItem,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from './todo.model';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly todoService = inject(TodoService);

  // Form fields
  protected newTitle = signal('');
  protected newCategory = signal<TodoCategory>('work');
  protected newDueDate = signal('');
  protected newDueTime = signal('');

  // Filter
  protected activeFilter = signal<TodoCategory | 'all'>('all');

  // Lookup maps for template use
  protected readonly categoryLabels = CATEGORY_LABELS;
  protected readonly categoryColors = CATEGORY_COLORS;
  protected readonly categories: TodoCategory[] = [
    'work',
    'training',
    'lessons',
    'other',
  ];

  protected readonly filteredItems = computed(() => {
    const filter = this.activeFilter();
    const all = this.todoService.items();
    if (filter === 'all') return all;
    return all.filter(i => i.category === filter);
  });

  protected readonly todayStr = new Date().toISOString().slice(0, 10);

  protected addTodo(): void {
    const title = this.newTitle().trim();
    if (!title) return;
    this.todoService.add(
      title,
      this.newCategory(),
      this.newDueDate(),
      this.newDueTime()
    );
    this.newTitle.set('');
    this.newDueDate.set('');
    this.newDueTime.set('');
  }

  protected toggle(item: TodoItem): void {
    this.todoService.toggle(item.id);
  }

  protected remove(item: TodoItem): void {
    this.todoService.remove(item.id);
  }

  protected setFilter(filter: TodoCategory | 'all'): void {
    this.activeFilter.set(filter);
  }

  protected colorOf(category: TodoCategory): string {
    return CATEGORY_COLORS[category];
  }

  protected labelOf(category: TodoCategory): string {
    return CATEGORY_LABELS[category];
  }

  protected formatDue(item: TodoItem): string {
    if (!item.dueDate) return '';
    const parts = [item.dueDate];
    if (item.dueTime) parts.push(item.dueTime);
    return parts.join(' ');
  }

  protected isOverdue(item: TodoItem): boolean {
    if (item.completed || !item.dueDate) return false;
    const dueStr = item.dueTime
      ? `${item.dueDate}T${item.dueTime}`
      : item.dueDate;
    return new Date(dueStr) < new Date();
  }
}
