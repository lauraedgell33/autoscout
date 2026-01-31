'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, CheckCircle, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BankAccount {
  id: number;
  account_type: 'buyer' | 'seller';
  account_holder: string;
  iban: string;
  bic_swift: string;
  bank_name: string;
  is_default: boolean;
  verified: boolean;
}

export default function AllBankAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    account_type: 'buyer' as 'buyer' | 'seller',
    account_holder: '',
    iban: '',
    bic_swift: '',
    bank_name: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank-accounts/all`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setAccounts(data.data || []);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank-accounts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      setFormData({
        account_type: 'buyer',
        account_holder: '',
        iban: '',
        bic_swift: '',
        bank_name: '',
      });
      setShowAddForm(false);
      fetchAccounts();
    } catch (error) {
      console.error('Error adding bank account:', error);
    }
  };

  const deleteAccount = async (id: number) => {
    if (!confirm('Delete this bank account?')) return;
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank-accounts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setAccounts(accounts.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const setDefaultAccount = async (id: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank-accounts/${id}/default`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchAccounts();
    } catch (error) {
      console.error('Error setting default:', error);
    }
  };

  const buyerAccounts = accounts.filter(a => a.account_type === 'buyer');
  const sellerAccounts = accounts.filter(a => a.account_type === 'seller');

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Bank Accounts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your bank accounts for payments and payouts</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />Add Account
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Add Bank Account</h3>
          <form onSubmit={addAccount} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Account Type *</label>
              <select
                value={formData.account_type}
                onChange={(e) => setFormData({...formData, account_type: e.target.value as 'buyer' | 'seller'})}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              >
                <option value="buyer">Buyer (Refunds)</option>
                <option value="seller">Seller (Payouts)</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bank-account-holder" className="block text-sm font-medium mb-1">Account Holder *</label>
                <Input id="bank-account-holder" name="accountHolder" required value={formData.account_holder} onChange={(e) => setFormData({...formData, account_holder: e.target.value})} autoComplete="name" />
              </div>
              <div>
                <label htmlFor="bank-bank-name" className="block text-sm font-medium mb-1">Bank Name *</label>
                <Input id="bank-bank-name" name="bankName" required value={formData.bank_name} onChange={(e) => setFormData({...formData, bank_name: e.target.value})} autoComplete="off" />
              </div>
              <div>
                <label htmlFor="bank-iban" className="block text-sm font-medium mb-1">IBAN *</label>
                <Input id="bank-iban" name="iban" required value={formData.iban} onChange={(e) => setFormData({...formData, iban: e.target.value})} placeholder="DE89370400440532013000" autoComplete="off" />
              </div>
              <div>
                <label htmlFor="bank-bic" className="block text-sm font-medium mb-1">BIC/SWIFT *</label>
                <Input id="bank-bic" name="bicSwift" required value={formData.bic_swift} onChange={(e) => setFormData({...formData, bic_swift: e.target.value})} placeholder="COBADEFFXXX" autoComplete="off" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button type="submit">Add Account</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Buyer Accounts */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-primary-600" />
          Buyer Accounts (Refunds)
        </h2>
        {buyerAccounts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No buyer accounts added</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {buyerAccounts.map((account) => (
              <Card key={account.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{account.bank_name}</h3>
                      {account.is_default && (
                        <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                          <CheckCircle className="h-3 w-3 mr-1" />Default
                        </span>
                      )}
                      {account.verified && (
                        <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{account.account_holder}</p>
                    <p className="text-sm font-mono text-gray-600 dark:text-gray-400">{account.iban}</p>
                  </div>
                  <div className="flex space-x-2">
                    {!account.is_default && (
                      <Button variant="outline" size="sm" onClick={() => setDefaultAccount(account.id)}>Set Default</Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => deleteAccount(account.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Seller Accounts */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Building2 className="h-5 w-5 mr-2 text-green-600" />
          Seller Accounts (Payouts)
        </h2>
        {sellerAccounts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No seller accounts added</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {sellerAccounts.map((account) => (
              <Card key={account.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{account.bank_name}</h3>
                      {account.is_default && (
                        <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                          <CheckCircle className="h-3 w-3 mr-1" />Default
                        </span>
                      )}
                      {account.verified && (
                        <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{account.account_holder}</p>
                    <p className="text-sm font-mono text-gray-600 dark:text-gray-400">{account.iban}</p>
                  </div>
                  <div className="flex space-x-2">
                    {!account.is_default && (
                      <Button variant="outline" size="sm" onClick={() => setDefaultAccount(account.id)}>Set Default</Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => deleteAccount(account.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
