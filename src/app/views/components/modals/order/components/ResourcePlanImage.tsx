import { PLAN_IMAGE } from '@/app/constants/app-contanst';
import { RobotIcon } from '@icons';

export const ResourcePlanImage = ({ plan }: { plan: string }) => {
  return (
    <div className="plan-images">
      <img
        src={PLAN_IMAGE[plan as keyof typeof PLAN_IMAGE]}
        width={90}
        height={90}
        alt="recommended-plan"
      />
      <div className="plan-icon">
        <RobotIcon width={24} height={24} />
      </div>
    </div>
  );
};
