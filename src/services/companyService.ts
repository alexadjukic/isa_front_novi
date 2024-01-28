import { AxiosResponse } from 'axios';
import api from '../lib/axios';
import { Company } from '../model/company';

export function searchCompanies(
    search: string,
    address: string,
): Promise<AxiosResponse<Company>> {
    return api.get<Company>(
        `companies/search?prefix=${search}&address=${address}`,
    );
}

export function getCompanyById(companyId: number) {
    try {
        return api.get<Company>(`companies/` + companyId);
    } catch (error) {
        console.error('Greška prilikom dobijanja detalja kompanije:', error);
        throw error;
    }
}
