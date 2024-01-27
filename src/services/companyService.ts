import { AxiosResponse } from "axios";
import api from "../lib/axios";
import { Company } from "../model/company";

export function searchCompanies(search: string, address: string): Promise<AxiosResponse<Company>> {
    return api.get<Company>(`companies/search?prefix=${search}&address=${address}`);
}