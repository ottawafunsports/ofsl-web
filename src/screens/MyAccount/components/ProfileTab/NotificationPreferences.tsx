import { Bell } from 'lucide-react';
import { NotificationPreferences as NotificationPreferencesType } from './types';

interface NotificationPreferencesProps {
  notifications: NotificationPreferencesType;
  onNotificationToggle: (key: keyof NotificationPreferencesType) => void;
}

export function NotificationPreferences({
  notifications,
  onNotificationToggle
}: NotificationPreferencesProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="h-5 w-5 text-[#6F6F6F]" />
        <h2 className="text-xl font-bold text-[#6F6F6F]">Notification Preferences</h2>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-[#6F6F6F]">Email Notifications</h3>
            <p className="text-sm text-[#6F6F6F]">Receive general updates via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.emailNotifications}
              onChange={() => onNotificationToggle('emailNotifications')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B20000]"></div>
          </label>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-[#6F6F6F]">Game Reminders</h3>
            <p className="text-sm text-[#6F6F6F]">Get notified before upcoming games</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.gameReminders}
              onChange={() => onNotificationToggle('gameReminders')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B20000]"></div>
          </label>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-[#6F6F6F]">League Updates</h3>
            <p className="text-sm text-[#6F6F6F]">Stay informed about league news and changes</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.leagueUpdates}
              onChange={() => onNotificationToggle('leagueUpdates')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B20000]"></div>
          </label>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-[#6F6F6F]">Payment Reminders</h3>
            <p className="text-sm text-[#6F6F6F]">Receive reminders for upcoming payments</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.paymentReminders}
              onChange={() => onNotificationToggle('paymentReminders')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B20000]"></div>
          </label>
        </div>
      </div>
    </div>
  );
}