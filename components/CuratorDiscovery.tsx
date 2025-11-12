import React, { useState, useMemo } from 'react';
import { getCuratorListData } from '../services/mockData';
import type { CuratorListData } from '../types';
import { LinkIcon, SearchIcon, TelescopeIcon, UsersIcon } from './icons';

interface CuratorDiscoveryProps {
    onViewProfile: (name: string) => void;
}

const CuratorCard: React.FC<{ curator: CuratorListData; onViewProfile: () => void; }> = ({ curator, onViewProfile }) => (
    <div className="bg-[var(--surface-primary)]/50 border border-[var(--border)] rounded-lg p-4 flex flex-col justify-between hover:border-[var(--accent-primary)] transition-colors">
        <div>
            <div className="flex items-start gap-4">
                <img src={curator.imageUrl} alt={curator.name} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{curator.name}</h3>
                    <p className="text-sm text-[var(--accent-primary)] font-medium">{curator.type}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{curator.job} - {curator.country}</p>
                </div>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-3 line-clamp-3 h-[60px]">{curator.presentation}</p>
        </div>
        <div className="mt-4 flex gap-2">
            <button onClick={onViewProfile} className="w-full text-center px-4 py-2 bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] text-[var(--text-primary)] font-semibold rounded-md text-sm transition-colors">
                View Profile
            </button>
            <a href={curator.website} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 px-3 py-2 bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <LinkIcon className="w-5 h-5"/>
            </a>
        </div>
    </div>
);

export const CuratorDiscovery: React.FC<CuratorDiscoveryProps> = ({ onViewProfile }) => {
    const [curators] = useState<CuratorListData[]>(getCuratorListData);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [countryFilter, setCountryFilter] = useState('all');

    const uniqueTypes = useMemo(() => ['all', ...Array.from(new Set(curators.map(c => c.type)))], [curators]);
    const uniqueCountries = useMemo(() => ['all', ...Array.from(new Set(curators.map(c => c.country)))], [curators]);

    const filteredCurators = useMemo(() => {
        return curators.filter(curator => {
            const matchesSearch = curator.name.toLowerCase().includes(searchTerm.toLowerCase()) || curator.job.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === 'all' || curator.type === typeFilter;
            const matchesCountry = countryFilter === 'all' || curator.country === countryFilter;
            return matchesSearch && matchesType && matchesCountry;
        });
    }, [curators, searchTerm, typeFilter, countryFilter]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h3 className="text-lg font-semibold text-[var(--accent-primary-hover)] mb-4 flex items-center gap-2">
                    <UsersIcon className="w-5 h-5" />
                    Discover Curators
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Browse, search, and filter our network of curators to find the perfect match for your music.</p>
            </div>
            
            {/* Filters */}
            <div className="p-4 bg-[var(--surface-primary)]/50 rounded-lg border border-[var(--border)] grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative col-span-full md:col-span-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
                    <input
                        type="search"
                        placeholder="Search by name or job..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--surface-secondary)] p-2 pl-10 rounded-md text-[var(--text-primary)] border border-[var(--border-secondary)]"
                    />
                </div>
                <div>
                    <label htmlFor="typeFilter" className="sr-only">Filter by Type</label>
                    <select id="typeFilter" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full bg-[var(--surface-secondary)] p-2 rounded-md text-[var(--text-primary)] border border-[var(--border-secondary)]">
                        {uniqueTypes.map(type => <option key={type} value={type}>{type === 'all' ? 'All Types' : type}</option>)}
                    </select>
                </div>
                <div>
                     <label htmlFor="countryFilter" className="sr-only">Filter by Country</label>
                    <select id="countryFilter" value={countryFilter} onChange={e => setCountryFilter(e.target.value)} className="w-full bg-[var(--surface-secondary)] p-2 rounded-md text-[var(--text-primary)] border border-[var(--border-secondary)]">
                        {uniqueCountries.map(country => <option key={country} value={country}>{country === 'all' ? 'All Countries' : country}</option>)}
                    </select>
                </div>
            </div>

            {/* Curator List */}
            {filteredCurators.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCurators.map(curator => (
                        <CuratorCard key={curator.id} curator={curator} onViewProfile={() => onViewProfile(curator.name)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-[var(--text-secondary)]">
                    <TelescopeIcon className="w-16 h-16 mx-auto text-[var(--border-secondary)] mb-4" />
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">No Curators Found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};