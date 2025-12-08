import { type FC } from 'react';

interface EmptyScreenProps {
  title?: string;
  info?: string;
}

// Simplified EmptyScreenView component for the streamlined leaks-focused app
export const EmptyScreenView: FC<EmptyScreenProps> = ({ 
  title = 'No Data Available', 
  info = 'There is no data to display at this moment.' 
}) => {
  return (
    <div className="empty-screen empty-card">
      <div className="empty-container">
        <div className="empty-card-wrapper">
          <div className="header">
            <div className="text">
              <h2 className="title">{title}</h2>
              <p>{info}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyScreenView;
