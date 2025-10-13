import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {  AuthService } from 'src/app/services/auth.service'; // adjust path if needed

// project import
import tableData from 'src/fake-data/default-data.json';
import { MonthlyBarChartComponent } from 'src/app/theme/shared/apexchart/monthly-bar-chart/monthly-bar-chart.component';
import { IncomeOverviewChartComponent } from 'src/app/theme/shared/apexchart/income-overview-chart/income-overview-chart.component';
import { AnalyticsChartComponent } from 'src/app/theme/shared/apexchart/analytics-chart/analytics-chart.component';
import { SalesReportChartComponent } from 'src/app/theme/shared/apexchart/sales-report-chart/sales-report-chart.component';

// icons
import { IconService, IconDirective } from '@ant-design/icons-angular';
import { FallOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    CardComponent,
    IconDirective,
    MonthlyBarChartComponent,
    IncomeOverviewChartComponent,
    AnalyticsChartComponent,
    SalesReportChartComponent
  ],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent {
  private iconService = inject(IconService);
  private dashboardService = inject(AuthService);

  recentOrder = tableData;

  AnalyticEcommerce = [
    {
      title: 'Total Reclamations',
      amount: '',
      background: 'bg-light-primary ',
      border: 'border-primary',
      icon: 'rise',
      percentage: '59.3%',
      color: 'text-primary',
      number: '35,000'
    },
    {
      title: 'Total Users',
      amount: 'Loading...',
      background: 'bg-light-primary ',
      border: 'border-primary',
      icon: 'rise',
      percentage: '70.5%',
      color: 'text-primary',
      number: '8,900'
    },
    {
      title: 'Total Offers',
      amount: '',
      background: 'bg-light-warning ',
      border: 'border-warning',
      icon: 'fall',
      percentage: '27.4%',
      color: 'text-warning',
      number: '1,943'
    },
    {
      title: 'Total Sales',
      amount: '$35,078',
      background: 'bg-light-warning ',
      border: 'border-warning',
      icon: 'fall',
      percentage: '27.4%',
      color: 'text-warning',
      number: '$20,395'
    }
  ];

  transaction = [
    {
      background: 'text-success bg-light-success',
      icon: 'gift',
      title: 'Order #002434',
      time: 'Today, 2:00 AM',
      amount: '+ $1,430',
      percentage: '78%'
    },
    {
      background: 'text-primary bg-light-primary',
      icon: 'message',
      title: 'Order #984947',
      time: '5 August, 1:45 PM',
      amount: '- $302',
      percentage: '8%'
    },
    {
      background: 'text-danger bg-light-danger',
      icon: 'setting',
      title: 'Order #988784',
      time: '7 hours ago',
      amount: '- $682',
      percentage: '16%'
    }
  ];

  constructor() {
  this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline]);

  // Update Total Users
  this.dashboardService.getTotalClients().subscribe(res => {
    const userCard = this.AnalyticEcommerce.find(card => card.title === 'Total Users');
    if (userCard) {
      userCard.amount = res.total_users.toLocaleString(); // e.g. "78,250"
    }
  });

this.dashboardService.getTotalReclamations().subscribe({
  next: res => {
    const reclamationCard = this.AnalyticEcommerce.find(card => card.title === 'Total Reclamations');
    if (reclamationCard) {
      reclamationCard.amount = res.total_reclamations.toLocaleString();
    }
  },
  error: err => {
    console.error('Failed to fetch reclamations:', err);
  }
});

this.dashboardService.getTotalcontrats().subscribe({
  next: res => {
    const contratCard = this.AnalyticEcommerce.find(card => card.title === 'Total Offers');
    if (contratCard) {
      contratCard.amount = res.total_contrats.toLocaleString();
    }
  },
  error: err => {
    console.error('Failed to fetch contrats:', err);
  }
});

  }}