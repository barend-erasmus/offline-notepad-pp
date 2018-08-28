import { Component, OnInit } from '@angular/core';
import { Repository } from './repository';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public content: string = null;

  public repository: Repository = new Repository();

  public selectedTabIndex: number = null;

  public tabs: string[] = null;

  constructor() {}

  public async ngOnInit(): Promise<void> {
    this.tabs = await this.repository.listTabNames();

    if (this.tabs.length === 0) {
      this.addNewTab();

      this.tabs = await this.repository.listTabNames();

      this.selectedTabIndex = 0;
    } else {
      this.selectedTabIndex = 0;
    }

    this.updateTabContent();
  }

  public async onChangeContent(): Promise<void> {
    await this.repository.updateTab(this.tabs[this.selectedTabIndex], this.content);
  }

  public async onClickCloseTab(index: number): Promise<void> {
    this.repository.deleteTab(this.tabs[index]);

    this.tabs = await this.repository.listTabNames();

    this.selectedTabIndex = 0;

    this.updateTabContent();
  }

  public async onClickNewTab(): Promise<void> {
    this.addNewTab();

    this.tabs = await this.repository.listTabNames();

    this.selectedTabIndex = this.tabs.length - 1;
  }

  public onClickTab(index: number): void {
    this.selectedTabIndex = index;

    this.updateTabContent();
  }

  protected addNewTab(): void {
    let index = 0;

    let name = `new ${index}`;

    while (this.tabs.indexOf(name) > -1) {
      index++;

      name = `new ${index}`;
    }

    this.repository.insertTab(name, null);
  }

  protected async updateTabContent(): Promise<void> {
    const name: string = this.tabs[this.selectedTabIndex];

    this.content = await this.repository.getTabContent(name);
  }
}