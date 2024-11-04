import React from 'react';
import { ProblemSetCategoryData } from '../../../../../../types/firebase/db/task/taskStructure';
import { Box, Divider, Typography } from '@mui/material';
import { arrayToRangeString } from '../../../../../../functions/utils/rangeUtils';
import { dictToArray, groupingByKey } from '../../../../../../functions/utils/objectUtils';
import { getDatesElements } from '../../../../../../functions/utils/dateTimeUtils';

interface SettingStateDisplayProps {
  categoryMap: Record<string, ProblemSetCategoryData>;
  problems: Record<string, number[]>;
  dates: Date[];
  distributionRatio: number[] | 'fillWithOne';
}

const SettingStateDisplay: React.FC<SettingStateDisplayProps> = ({ categoryMap, problems, dates, distributionRatio }) => {
  const groupedDates = dictToArray(groupingByKey(getDatesElements(dates), 'months'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
      <Box sx={{ marginBottom: 2 }}>
        {groupedDates.map(dates => {
          if (dates.length === 0) {
            return null;
          }

          return (
            <Box key={dates[0].months} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', minWidth: 80, marginRight: 1,  textAlign: 'end' }}>
                {dates[0].months}月
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                  {arrayToRangeString(dates.map(date => date.date), { unit: '日' })}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
      <Divider />
      {Object.keys(problems).map(key => {
        const category = categoryMap[key];
        const name = category.isPage ? 'ページ' : category.name ?? '不明';
        const numbers = problems[key];
        const ranges = arrayToRangeString(numbers);

        return (
          <Box key={key} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
            <Typography sx={{ minWidth: 80, textAlign: 'end', marginRight: 1, color: 'text.primary', fontWeight: 500 }}>
              {name}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              {ranges}
            </Typography>
          </Box>
        );
      })}
      <Divider />
      <Box>
        <Typography>
          {dates.length}日
        </Typography>
        <Typography>
          {Object.keys(problems).reduce((acc, key) => {
            return acc + problems[key].length
          }, 0)}問
        </Typography>
      </Box>
    </Box>
  );
};

export default SettingStateDisplay;
