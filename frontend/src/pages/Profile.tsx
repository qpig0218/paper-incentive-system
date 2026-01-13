import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Edit2,
  Save,
  X,
  Shield,
  Bell,
  Key,
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  employeeId: string;
  avatar?: string;
}

// Mock user data
const mockUser: UserProfile = {
  id: '1',
  name: '王大明',
  email: 'daming.wang@chimei.org.tw',
  phone: '06-2812811',
  department: '心臟內科',
  position: '主治醫師',
  employeeId: 'CM001234',
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(mockUser);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
    // In production, call API to update user profile
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', label: '個人資料', icon: User },
    { id: 'security', label: '安全設定', icon: Shield },
    { id: 'notifications', label: '通知設定', icon: Bell },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">帳號設定</h1>
          <p className="text-slate-500 mt-1">管理您的個人資料與系統設定</p>
        </div>

        {/* Profile Card */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {user.name.charAt(0)}
              </span>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
              <p className="text-slate-500 mt-1">{user.department} · {user.position}</p>
              <p className="text-sm text-slate-400 mt-2">員工編號: {user.employeeId}</p>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                編輯資料
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-card p-2 mb-6">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h3 className="font-semibold text-slate-800 mb-6">個人資料</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  姓名
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <p className="text-slate-800 py-3">{user.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  電子郵件
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <p className="text-slate-800 py-3">{user.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  聯絡電話
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <p className="text-slate-800 py-3">{user.phone}</p>
                )}
              </div>

              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  員工編號
                </label>
                <p className="text-slate-800 py-3">{user.employeeId}</p>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  所屬部門
                </label>
                {isEditing ? (
                  <select
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="input-field"
                  >
                    <option value="心臟內科">心臟內科</option>
                    <option value="神經內科">神經內科</option>
                    <option value="胸腔內科">胸腔內科</option>
                    <option value="消化內科">消化內科</option>
                    <option value="腎臟內科">腎臟內科</option>
                    <option value="一般外科">一般外科</option>
                    <option value="骨科">骨科</option>
                    <option value="護理部">護理部</option>
                  </select>
                ) : (
                  <p className="text-slate-800 py-3">{user.department}</p>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  職稱
                </label>
                {isEditing ? (
                  <select
                    value={editForm.position}
                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                    className="input-field"
                  >
                    <option value="主治醫師">主治醫師</option>
                    <option value="住院醫師">住院醫師</option>
                    <option value="專科護理師">專科護理師</option>
                    <option value="護理師">護理師</option>
                    <option value="研究員">研究員</option>
                  </select>
                ) : (
                  <p className="text-slate-800 py-3">{user.position}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
                <button
                  onClick={handleCancel}
                  className="btn-secondary flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  儲存變更
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h3 className="font-semibold text-slate-800 mb-6">安全設定</h3>

            <div className="space-y-6">
              {/* Change Password */}
              <div className="p-4 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Key className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">變更密碼</h4>
                      <p className="text-sm text-slate-500">定期更換密碼以確保帳號安全</p>
                    </div>
                  </div>
                  <button className="btn-secondary text-sm">變更密碼</button>
                </div>
              </div>

              {/* Two Factor Auth */}
              <div className="p-4 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">雙重驗證</h4>
                      <p className="text-sm text-slate-500">啟用雙重驗證增加帳號安全性</p>
                    </div>
                  </div>
                  <button className="btn-secondary text-sm">設定</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h3 className="font-semibold text-slate-800 mb-6">通知設定</h3>

            <div className="space-y-4">
              {[
                { id: 'email_updates', label: '電子郵件通知', description: '收到審核結果時發送電子郵件' },
                { id: 'approval_notify', label: '核准通知', description: '論文獎勵申請核准時通知' },
                { id: 'deadline_remind', label: '截止日提醒', description: '申請截止日前發送提醒' },
                { id: 'system_updates', label: '系統更新', description: '收到系統更新與維護通知' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div>
                    <h4 className="font-medium text-slate-800">{item.label}</h4>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;
