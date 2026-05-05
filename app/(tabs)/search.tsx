import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { ScreenShell } from '@/components/screen-shell';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ProductCard } from '@/components/ui/product-card';
import { ActionButton } from '@/components/ui/action-button';
import { Palette, radius, spacing } from '@/constants/theme';
import { EventName, trackEvent } from '@/src/analytics/events';
import { useLanguage } from '@/src/hooks/use-language';
import { productsService } from '@/src/services/products/products-service';
import type { Product } from '@/src/types/product';

export default function SearchScreen(){const {t}=useLanguage();const [query,setQuery]=useState('');const [results,setResults]=useState<Product[]>([]);const [loading,setLoading]=useState(false);const [error,setError]=useState(false);const [searched,setSearched]=useState(false);
const handleSearch=async()=>{if(!query.trim()){setSearched(false);setResults([]);return;}setLoading(true);setError(false);setSearched(true);trackEvent(EventName.ProductSearchStarted);try{const data=await productsService.searchByName(query.trim());setResults(data);trackEvent(EventName.ProductSearchCompleted,{hasResults:data.length>0});}catch{setError(true);trackEvent(EventName.ProductSearchFailure,{reason:'unknown_error'});}finally{setLoading(false);}};
return <ScreenShell title={t('search.title')} subtitle={t('search.subtitle')}><View style={styles.searchRow}><TextInput style={styles.input} value={query} onChangeText={setQuery} placeholder={t('search.placeholder')}/><ActionButton label={t('common.search')} onPress={handleSearch} disabled={loading}/></View>{!searched&&!loading?<EmptyState title={t('search.idleTitle')} description={t('search.idleDescription')}/>:null}{loading?<LoadingState label={t('search.loading')}/>:null}{error?<ErrorState title={t('search.errorTitle')} description={t('search.errorDescription')}/>:null}{searched&&!loading&&!error&&results.length===0?<><EmptyState title={t('search.noResultsTitle')} description={t('search.noResultsDescription')}/><Link href="/scanner" asChild><ActionButton label={t('search.scanAction')} onPress={()=>undefined} variant="secondary"/></Link></>:null}{results.map((item)=><ProductCard key={item.id} product={item}/>)}</ScreenShell>}
const styles=StyleSheet.create({searchRow:{gap:spacing.sm},input:{borderWidth:1,borderColor:Palette.border,borderRadius:radius.md,padding:spacing.md,backgroundColor:Palette.surface,minHeight:48,color:Palette.text}});
