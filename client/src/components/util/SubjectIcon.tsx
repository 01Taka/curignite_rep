import React, { FC } from 'react'
import { Subject } from '../../types/firebase/db/common/commonTypes'
import { subjectColors, subjectLabels } from '../../constants/components/subjectLabels';
import { cn } from '../../functions/utils';
interface SubjectIconProps {
  subject: Subject;
  className?: string;
}

const SubjectIcon: FC<SubjectIconProps> = ({ subject, className = "absolute top-0 right-0" }) => {
  return (
    <div style={{ backgroundColor: subjectColors[subject] }} className={cn("w-16 h-8 rounded-md", className, "flex justify-center items-center")}>
      {subjectLabels[subject]}
    </div>
  )
}

export default SubjectIcon