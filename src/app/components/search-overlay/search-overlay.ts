import { Component, output, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-overlay',
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './search-overlay.html',
  styleUrls: ['./search-overlay.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchOverlayComponent {
  close = output<void>();
  searchQuery = signal('');

  suggestions = [
    { icon: 'sync_alt', label: 'Chia hóa đơn' },
    { icon: 'compare_arrows', label: 'Chuyển tiền đơn giản' },
    { icon: 'percent', label: 'Tỷ giá' },
    { icon: 'account_circle', label: 'TK hưởng trong nước thường dùng' },
  ];

  filteredSuggestions = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.suggestions;
    }
    return this.suggestions.filter(item =>
      item.label.toLowerCase().includes(query)
    );
  });

  onCancel() {
    this.close.emit();
  }

  onSearch() {
    // Handle search action
    console.log('Search for:', this.searchQuery());
  }
}

