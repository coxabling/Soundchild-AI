import React, { useState } from 'react';
import type { WalletData, Transaction, CreditPack } from '../types';
import { ArrowDownCircleIcon, ArrowUpCircleIcon, CoinsIcon, CreditCardIcon, CoinbaseIcon, WalletIcon, StripeIcon, PayPalIcon } from './icons';
import { useNotification } from '../App';
import { mockCreditPacks } from '../services/mockData';
import { LoadingSpinner } from './LoadingSpinner';

interface WalletProps {
    walletData: WalletData;
    setWalletData: React.Dispatch<React.SetStateAction<WalletData>>;
    userType: 'artist' | 'curator';
}

const TransactionRow: React.FC<{ tx: Transaction }> = ({ tx }) => {
    const isCredit = ['credit_purchase', 'credit_spend'].includes(tx.type);
    const isDeposit = ['deposit', 'payout', 'bonus', 'tip', 'credit_purchase'].includes(tx.type);
    const amountColor = isDeposit ? 'text-[var(--positive)]' : 'text-[var(--negative)]';
    const Icon = isDeposit ? ArrowUpCircleIcon : ArrowDownCircleIcon;
    const unit = isCredit ? 'credits' : '$';
    const amount = isCredit ? tx.amount : tx.amount.toFixed(2);
    
    return (
        <li className="flex items-center justify-between p-3 bg-[var(--surface-secondary)]/50 rounded-md">
            <div className="flex items-center gap-3">
                <Icon className={`w-6 h-6 ${amountColor}`} />
                <div>
                    <p className="font-medium text-[var(--text-primary)]">{tx.description}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{tx.date}</p>
                </div>
            </div>
            <p className={`font-mono font-semibold ${amountColor}`}>
                {isDeposit ? '+' : ''}{amount} {isCredit && unit}
            </p>
        </li>
    );
};

const PurchaseCreditsModal: React.FC<{
    onPurchase: (pack: CreditPack) => void;
    onClose: () => void;
}> = ({ onPurchase, onClose }) => {
    const [selectedPack, setSelectedPack] = useState<CreditPack | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePurchase = () => {
        if (!selectedPack || !paymentMethod) return;

        setIsProcessing(true);
        setTimeout(() => {
            onPurchase(selectedPack);
            // The onPurchase in the parent will close the modal and show a success message.
            setIsProcessing(false);
        }, 1500);
    };

    if (isProcessing) {
        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-30 p-4">
                <div className="bg-[var(--surface-primary)] border border-[var(--border)] rounded-xl max-w-sm w-full p-8 text-center shadow-2xl">
                    <LoadingSpinner />
                    <p className="mt-4 text-[var(--text-secondary)]">Processing your payment securely...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-30 p-4" onClick={onClose}>
            <div className="bg-[var(--surface-primary)] border border-[var(--border)] rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                {!selectedPack ? (
                    <>
                        <h3 className="text-2xl font-bold text-[var(--accent-primary)] text-center">Purchase Submission Credits</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                            {mockCreditPacks.map(pack => (
                                <div key={pack.id} className="p-4 border border-[var(--border-secondary)] rounded-lg text-center bg-[var(--background-secondary)] flex flex-col justify-between">
                                    <div>
                                        <p className="text-4xl font-bold text-[var(--accent-primary)]">{pack.credits}</p>
                                        <p className="text-[var(--text-primary)]/80">Credits</p>
                                        {pack.bonus && <p className="text-xs text-[var(--warning)] bg-yellow-900/50 rounded-full px-2 py-0.5 inline-block mt-2">{pack.bonus}</p>}
                                    </div>
                                    <button onClick={() => setSelectedPack(pack)} className="mt-4 w-full px-4 py-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-semibold rounded-md transition-colors">
                                        ${pack.price}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="text-center pt-2">
                            <button onClick={onClose} className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm">Cancel</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="text-2xl font-bold text-[var(--accent-primary)]">Complete Your Purchase</h3>
                        <div className="p-4 bg-[var(--surface-secondary)] rounded-lg flex justify-between items-center">
                            <p className="text-[var(--text-primary)]">You are purchasing <strong className="text-[var(--accent-primary)]">{selectedPack.credits} Credits</strong></p>
                            <p className="text-xl font-bold text-[var(--text-primary)]">${selectedPack.price.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">Select Payment Method:</p>
                            <div className="space-y-3">
                                <button onClick={() => setPaymentMethod('stripe')} className={`w-full text-left p-3 flex items-center gap-4 rounded-lg border-2 transition-colors ${paymentMethod === 'stripe' ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : 'border-[var(--border-secondary)] bg-[var(--surface-secondary)]/50 hover:border-[var(--border-secondary)]/80'}`}>
                                    <StripeIcon className="w-10 h-10 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-[var(--text-primary)]">Pay with Card</p>
                                        <p className="text-xs text-[var(--text-secondary)]">Powered by Stripe</p>
                                    </div>
                                </button>
                                <button onClick={() => setPaymentMethod('paypal')} className={`w-full text-left p-3 flex items-center gap-4 rounded-lg border-2 transition-colors ${paymentMethod === 'paypal' ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : 'border-[var(--border-secondary)] bg-[var(--surface-secondary)]/50 hover:border-[var(--border-secondary)]/80'}`}>
                                    <PayPalIcon className="w-10 h-10 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-[var(--text-primary)]">Pay with PayPal</p>
                                        <p className="text-xs text-[var(--text-secondary)]">Redirect to PayPal to complete</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <button onClick={() => setSelectedPack(null)} className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm">Back</button>
                            <button onClick={handlePurchase} disabled={!paymentMethod} className="px-6 py-3 bg-[var(--positive)] hover:bg-green-600 text-white font-bold rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                                Pay ${selectedPack.price.toFixed(2)}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const WithdrawModal: React.FC<{
    onAction: (amount: number, method: string) => void;
    onClose: () => void;
    method: 'Bank' | 'Crypto';
}> = ({ onAction, onClose, method }) => {
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAction = () => {
        const numericAmount = parseFloat(amount);
        if (numericAmount > 0) {
            setIsProcessing(true);
            setTimeout(() => { // Simulate network delay
                onAction(numericAmount, method);
                setIsProcessing(false);
                onClose();
            }, 1000);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-30 p-4" onClick={onClose}>
            <div className="bg-[var(--surface-primary)] border border-[var(--border)] rounded-xl max-w-sm w-full p-6 space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-[var(--accent-primary)]">Withdraw via {method}</h3>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Amount ($)</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-[var(--background-secondary)] p-2 rounded-md text-[var(--text-primary)] border border-[var(--border-secondary)] focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)]"
                    />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button onClick={onClose} className="px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] rounded-md transition-colors">Cancel</button>
                    <button onClick={handleAction} disabled={isProcessing || !amount || parseFloat(amount) <= 0} className="px-4 py-2 bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white font-semibold rounded-md disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                        {isProcessing ? 'Processing...' : 'Withdraw'}
                    </button>
                </div>
            </div>
        </div>
    );
};


export const Wallet: React.FC<WalletProps> = ({ walletData, setWalletData, userType }) => {
    const [modal, setModal] = useState<'closed' | 'purchase' | 'withdraw_bank' | 'withdraw_crypto'>('closed');
    const { addNotification } = useNotification();
    
    const handlePurchaseCredits = (pack: CreditPack) => {
        if (pack.price > walletData.balance) {
            addNotification({ message: 'Insufficient funds to purchase credits.', type: 'error' });
            return;
        }

        const purchaseTx: Transaction = {
            id: `tx_buy_${Date.now()}`,
            type: 'credit_purchase',
            description: `${pack.credits} Credit Pack`,
            amount: -pack.price,
            date: new Date().toISOString().split('T')[0]
        };

        setWalletData(prev => ({
            balance: prev.balance - pack.price,
            credits: prev.credits + pack.credits + (pack.bonus ? parseInt(pack.bonus.replace(/\D/g, '')) : 0),
            transactions: [purchaseTx, ...prev.transactions]
        }));
        
        addNotification({ message: `Successfully purchased ${pack.credits} credits!`, type: 'success' });
        setModal('closed');
    };
    
    const handleWithdraw = (amount: number, method: string) => {
        if (amount > walletData.balance) {
            addNotification({ message: 'Insufficient funds for withdrawal.', type: 'error' });
            return;
        }
        const newTransaction: Transaction = {
            id: `tx_wd_${Date.now()}`,
            type: 'withdrawal',
            description: `Withdrawal to ${method}`,
            amount: -amount,
            date: new Date().toISOString().split('T')[0]
        };
        setWalletData(prev => ({
            ...prev,
            balance: prev.balance - amount,
            transactions: [newTransaction, ...prev.transactions]
        }));
        addNotification({ message: `Withdrawal of $${amount.toFixed(2)} initiated!`, type: 'success' });
    };

    return (
        <div className="space-y-6">
            {modal === 'purchase' && <PurchaseCreditsModal onPurchase={handlePurchaseCredits} onClose={() => setModal('closed')} />}
            {modal === 'withdraw_bank' && <WithdrawModal onAction={handleWithdraw} onClose={() => setModal('closed')} method="Bank" />}
            {modal === 'withdraw_crypto' && <WithdrawModal onAction={handleWithdraw} onClose={() => setModal('closed')} method="Crypto" />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="text-center p-6 bg-[var(--surface-primary)]/50 rounded-lg border border-[var(--border)]">
                    <p className="text-[var(--text-secondary)] text-sm">Cash Balance</p>
                    <p className="text-5xl font-bold text-[var(--positive)]">${walletData.balance.toFixed(2)}</p>
                </div>
                 {userType === 'artist' && (
                     <div className="text-center p-6 bg-[var(--surface-primary)]/50 rounded-lg border border-[var(--border)]">
                        <p className="text-[var(--text-secondary)] text-sm">Submission Credits</p>
                        <p className="text-5xl font-bold text-[var(--accent-primary)] flex items-center justify-center gap-2">
                            <CoinsIcon className="w-10 h-10" />
                            {walletData.credits}
                        </p>
                    </div>
                )}
            </div>
            
            {userType === 'artist' ? (
                 <button onClick={() => setModal('purchase')} className="w-full py-3 text-lg font-bold text-white bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] rounded-lg transition-colors flex items-center justify-center gap-2">
                     <CoinsIcon className="w-6 h-6" /> Purchase Credits
                 </button>
            ) : (
                <div className="space-y-3">
                     <h4 className="text-lg font-semibold text-[var(--accent-primary-hover)]">Payout Methods</h4>
                     <button onClick={() => setModal('withdraw_bank')} className="w-full text-left p-4 flex items-center gap-4 bg-[var(--surface-primary)]/50 hover:bg-[var(--surface-secondary)]/80 rounded-lg border border-[var(--border)] hover:border-[var(--accent-primary)] transition-colors">
                        <CreditCardIcon className="w-8 h-8 text-[var(--accent-primary)]"/>
                        <div>
                            <p className="font-bold text-[var(--text-primary)]">Bank Transfer</p>
                            <p className="text-sm text-[var(--text-secondary)]">3-5 business days</p>
                        </div>
                    </button>
                    <button onClick={() => setModal('withdraw_crypto')} className="w-full text-left p-4 flex items-center gap-4 bg-[var(--surface-primary)]/50 hover:bg-[var(--surface-secondary)]/80 rounded-lg border border-[var(--border)] hover:border-[var(--accent-primary)] transition-colors">
                        <CoinbaseIcon className="w-8 h-8 text-[var(--accent-primary)]"/>
                        <div>
                            <p className="font-bold text-[var(--text-primary)]">Withdraw via Crypto</p>
                            <p className="text-sm text-[var(--text-secondary)]">Instant transfer via Coinbase</p>
                        </div>
                    </button>
                </div>
            )}
            
            <div>
                <h4 className="text-lg font-semibold text-[var(--accent-primary-hover)] mb-4">Transaction History</h4>
                {walletData.transactions.length > 0 ? (
                    <ul className="space-y-2">
                        {walletData.transactions.map(tx => <TransactionRow key={tx.id} tx={tx} />)}
                    </ul>
                ) : (
                     <div className="text-center py-12 text-[var(--text-secondary)]">
                        <WalletIcon className="w-16 h-16 mx-auto text-[var(--border-secondary)] mb-4" />
                        <h3 className="text-xl font-bold text-[var(--text-primary)]">No Transactions Yet</h3>
                        <p>Your transaction history will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};