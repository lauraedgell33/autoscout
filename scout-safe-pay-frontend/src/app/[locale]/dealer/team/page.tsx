'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Mail, Shield, Trash2, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joined_at: string;
}

export default function DealerTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', role: 'member' });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dealer/team`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setMembers(data.data || []);
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  const inviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dealer/team/invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inviteData),
      });
      setInviteData({ email: '', role: 'member' });
      setShowInviteForm(false);
      fetchTeam();
    } catch (error) {
      console.error('Error inviting member:', error);
    }
  };

  const removeMember = async (id: number) => {
    if (!confirm('Remove this team member?')) return;
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dealer/team/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setMembers(members.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{(members || []).length} team members</p>
        </div>
        <Button onClick={() => setShowInviteForm(!showInviteForm)}>
          <UserPlus className="h-4 w-4 mr-2" />Invite Member
        </Button>
      </div>

      {showInviteForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Invite Team Member</h3>
          <form onSubmit={inviteMember} className="space-y-4">
            <div>
              <label htmlFor="team-email" className="block text-sm font-medium mb-1">Email *</label>
              <Input id="team-email" name="email" type="email" required value={inviteData.email} onChange={(e) => setInviteData({...inviteData, email: e.target.value})} placeholder="member@example.com" autoComplete="email" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role *</label>
              <select value={inviteData.role} onChange={(e) => setInviteData({...inviteData, role: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                <option value="member">Member</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowInviteForm(false)}>Cancel</Button>
              <Button type="submit">Send Invitation</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="overflow-hidden">
        {!members || members.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No team members yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Invite members to collaborate</p>
            <Button onClick={() => setShowInviteForm(true)}>
              <UserPlus className="h-4 w-4 mr-2" />Invite First Member
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 text-sm font-medium">{member.name}</td>
                    <td className="px-6 py-4 text-sm">{member.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        <Shield className="h-3 w-3 mr-1" />{member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {member.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" onClick={() => removeMember(member.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
