import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {VaadinCharts, DataSeries } from '../../bower_components/vaadin-charts/directives/vaadin-charts';

@Component({
    selector: 'overview-panel',
    templateUrl: './app/overview-panel/overview_panel.component.html',
    styleUrls: ['./app/overview-panel/overview_panel.component.css'],
    directives: [VaadinCharts, DataSeries]
})
export class OverviewPanel implements OnInit {

    private displayPeriod: number;
    private totalExpensesInDollar: string;
    private monthlyExpenses: number[];
    private xAxisLabels: string[];

    constructor() {
        this.displayPeriod = 12;
        this.xAxisLabels = new Array(this.displayPeriod + 1);
        this.monthlyExpenses = new Array(this.displayPeriod + 1);
    };

    setExpenses() {
      let before = new Date();
      let after = new Date();
      after.setFullYear(before.getFullYear() - 1);
      const url = './api/expenses?index=322&count=&before=' + before.toDateString() +
          '&after=' + after.toDateString();
      window.getJSON(url, (data) => this.setData(data));
    }

    ngOnInit() {
        this.initXAxis();
        this.setExpenses();
    }

    setData(data: string[]) {
        let today = new Date();
        let totalExpenses = 0;
        let newMonthlyExpenses = [];
        for (var i = 0; i <= this.displayPeriod; i++) {
            newMonthlyExpenses[i] = 0;
        }
        for (var expense of data) {
            let expenseDate = new Date(expense.date);
            let idx = today.getMonth() - expenseDate.getMonth();
            idx = (idx >= 0) ? idx : (this.displayPeriod + idx);
            if ((expenseDate.getMonth() == today.getMonth()) && (expenseDate.getFullYear() != today.getFullYear())) {
                idx = this.displayPeriod;
            }
            newMonthlyExpenses[idx] = newMonthlyExpenses[idx] + parseFloat(expense.total);
            totalExpenses = totalExpenses + parseFloat(expense.total);
        }
        this.monthlyExpenses = newMonthlyExpenses;
        this.totalExpensesInDollar = this.dollarFormat(totalExpenses);
    }

    dollarFormat(amount: number): string {
        let amountInDollar: string = amount.toFixed(2);
        let commaPosition = amountInDollar.indexOf(".") - 3;
        return '$' + amountInDollar.substr(0, commaPosition) + ','
                + amountInDollar.substr(commaPosition, amountInDollar.length);
    }

    initXAxis() {
        let currentDate = new Date();
        let currentLabel = currentDate.getFullYear() + " "
            + currentDate.toDateString().substr(4, 3);
        for (var i = 0; i <= this.displayPeriod; i++) {
            this.xAxisLabels[i] = currentLabel;
            currentDate.setMonth((currentDate.getMonth() - 1));
            currentLabel = currentDate.toDateString().substr(4, 3);
            if (currentLabel == "Dec") {
                currentLabel = currentDate.getFullYear() + " " + currentLabel;
            }
        }
    }
}
