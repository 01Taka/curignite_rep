import { Tab, Tabs, Box } from '@mui/material';
import React, { ReactNode, useState } from 'react';

interface TabPanelProps {
    children: ReactNode;
    value: number;
    index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
};

interface TopTabProps {
    titles: string[];
    childrenList: ReactNode[];
}

const TopTab: React.FC<TopTabProps> = ({ titles, childrenList }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth">
                {titles.map((title, index) => (
                    <Tab label={title} key={index} id={`tab-${index}`} aria-controls={`tabpanel-${index}`} wrapped />
                ))}
            </Tabs>
            {childrenList && childrenList.map((children, index) => (
                <div key={index} className='bg-blue-50'>
                    <TabPanel value={value} index={index}>
                        {children}
                    </TabPanel>
                </div>
            ))}
        </div>
    );
};

export default TopTab;
