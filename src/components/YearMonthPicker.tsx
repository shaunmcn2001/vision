import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarBlank, CaretLeft, CaretRight } from '@phosphor-icons/react';

interface YearMonthPickerProps {
  selectedYear: number;
  selectedMonth: number | null;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number | null) => void;
  availableYears?: number[];
  disabled?: boolean;
}

const MONTHS = [
  { value: 1, name: 'January', short: 'Jan' },
  { value: 2, name: 'February', short: 'Feb' },
  { value: 3, name: 'March', short: 'Mar' },
  { value: 4, name: 'April', short: 'Apr' },
  { value: 5, name: 'May', short: 'May' },
  { value: 6, name: 'June', short: 'Jun' },
  { value: 7, name: 'July', short: 'Jul' },
  { value: 8, name: 'August', short: 'Aug' },
  { value: 9, name: 'September', short: 'Sep' },
  { value: 10, name: 'October', short: 'Oct' },
  { value: 11, name: 'November', short: 'Nov' },
  { value: 12, name: 'December', short: 'Dec' },
];

export function YearMonthPicker({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  availableYears = [2020, 2021, 2022, 2023, 2024],
  disabled = false,
}: YearMonthPickerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'select'>('grid');

  const currentYear = new Date().getFullYear();
  const years = availableYears.length > 0 ? availableYears : 
    Array.from({ length: 5 }, (_, i) => currentYear - i).reverse();

  const canGoPrevYear = selectedYear > Math.min(...years);
  const canGoNextYear = selectedYear < Math.max(...years);

  const handlePrevYear = () => {
    if (canGoPrevYear) {
      onYearChange(selectedYear - 1);
    }
  };

  const handleNextYear = () => {
    if (canGoNextYear) {
      onYearChange(selectedYear + 1);
    }
  };

  const handleMonthClick = (monthValue: number) => {
    if (selectedMonth === monthValue) {
      onMonthChange(null); // Deselect if already selected (annual view)
    } else {
      onMonthChange(monthValue);
    }
  };

  const getMonthDisplayName = (month: number | null) => {
    if (!month) return 'Annual View';
    return MONTHS.find(m => m.value === month)?.name || '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarBlank className="h-5 w-5" />
          Time Period
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Year Navigation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Year</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevYear}
                disabled={disabled || !canGoPrevYear}
                className="h-8 w-8 p-0"
              >
                <CaretLeft className="h-4 w-4" />
              </Button>
              
              <div className="min-w-[80px] text-center">
                <Badge variant="outline" className="text-sm font-semibold">
                  {selectedYear}
                </Badge>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextYear}
                disabled={disabled || !canGoNextYear}
                className="h-8 w-8 p-0"
              >
                <CaretRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Year Select Dropdown */}
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => onYearChange(parseInt(value))}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Month Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Month</span>
            <Badge variant={selectedMonth ? 'default' : 'secondary'}>
              {getMonthDisplayName(selectedMonth)}
            </Badge>
          </div>

          {/* Annual View Button */}
          <Button
            variant={selectedMonth === null ? 'default' : 'outline'}
            className="w-full"
            onClick={() => onMonthChange(null)}
            disabled={disabled}
          >
            Annual View
          </Button>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month) => (
              <Button
                key={month.value}
                variant={selectedMonth === month.value ? 'default' : 'ghost'}
                size="sm"
                className="h-9 text-xs"
                onClick={() => handleMonthClick(month.value)}
                disabled={disabled}
              >
                {month.short}
              </Button>
            ))}
          </div>
        </div>

        {/* Current Selection Summary */}
        <div className="pt-3 border-t">
          <div className="text-xs text-muted-foreground">
            <p>Current selection:</p>
            <p className="font-medium text-foreground mt-1">
              {selectedMonth 
                ? `${getMonthDisplayName(selectedMonth)} ${selectedYear}`
                : `${selectedYear} (Annual)`
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}