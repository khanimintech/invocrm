import React, { useState, useRef, useEffect } from 'react';
import PageContent from '../../components/PageContainer';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { AnnexesService } from '../../services/AnnexesService';
import { ContractsService } from '../../services/ContractsService';
import ExtendedTable from '../../components/ExtendedTable';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import BlockIcon from '@material-ui/icons/Block';
import { annexStatuses } from './../../constants';
import ContractAnnexModal from './../contracts/ContractAnnexModal';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';



const initialOverviews = [
    { id: 1, status: "ƏDV-siz", count: 0, icon: <MoneyOffIcon/>, color: "#002e57"  },
    { id: 2, status: "ƏDV-li", count: 0, icon: <AttachMoneyIcon />, color: "rgb(90 89 204)"},
    { id: 3, status: "Prosesdə", count: 0, icon: <HourglassEmptyIcon />, color:  "#42A5F5"},
    { id: 4, status: "Təsdiqlənib", count: 0, icon: <CheckCircleIcon />, color:"#66BB6A" },
    { id: 5, status: "Ləğv edilib", count: 0, icon:  <BlockIcon />, color: "#585051" },
]

const columns = [
    { field: 'company_name', header: 'Şirkət', filter: true },
    { field: 'request_no', header: 'Sorğu №', filter: true, showDetails: true  },
    { field: 'contract_no', header: 'Müqavilə Nömrəsi' , filter: true },
    { field: 'contract_type', header: 'Müqavilə Növü' , filter: true },
    { field: 'annex_no', header: 'Əlavə №' , filter: true },
    { field: 'sales_manager', header: "Satış Meneceri" , filter: true },
    // { field: '1', header: "Məhsul", filter: true  },
    { field: 'payment_terms', header: "Ödəniş şərti" , filter: true },
    { field: 'sum_no_invoice', header: "Məbləğ (ƏDV-siz)" , filter: false },
    { field: 'sum_with_invoice', header: "Məbləğ (ƏDV-li)" , filter: false },
    { field: 'revision_count', header: "Revision" , filter: false },
    { field: 'created', header: 'Yaradılma Tarixi', filter: true  },
    { field: 'status', header: 'Status', filter: true  },
];


const Annexes = ({ handleRequest, user, loading, enqueueSnackbar }) => {
    let dt = useRef(null);

    const [overviews, setOverviews] = useState(initialOverviews);
    const [annexes, setAnnexes] = useState(null);
    const [filters, setFilters] = useState({});
    const [tableLoading, toggleLoading] = useState(false);
    const [allCount, setAllCount] = useState(0);
    const [modalLoading, toggleModalLoading] = useState(false);
    const [annexType, setAnnexType] = useState();
    const [annexModal, toggleAnnexModal] = useState();
    const [selectedAnex, setSelectedAnnex] = useState()
    const [sellers, setSellers] = useState([]);
    const [salesManagers, setSalesManagers] = useState([]);
    const [units, setUnits] = useState([]);



    useEffect(() => {
      getSalesManagers()
        getSellers();
        getUnits();
  }, [])

    useEffect(() => {
        getOverviews();
    }, [filters.annex_created_after, filters.annex_created_before])


    const getAnnexes = (filters) => {
        toggleLoading(true)
        return handleRequest(
            AnnexesService.index(filters)
        ).then(res => {
            if (res.body){
                toggleLoading(false)
                setAnnexes(res.body)
            }

            
        })
    }

   const getSalesManagers = () => {
        handleRequest(
            ContractsService.getSalesManagers()
        )
        .then(res => setSalesManagers(res.body.map(salesManager => ({ value: salesManager.id, label: salesManager.fullname }))))
    }

    const getSellers = () => {
        handleRequest(
            ContractsService.getSellers()
        )
        .then(res => setSellers(res.body.map(seller => ({ value: seller.id, label: seller.fullname }))))
    }

    const getUnits = () => {
        handleRequest(
            AnnexesService.getUnits()
        ).then((res) => {
            if (res.body)
                setUnits(res.body)
        })
    }


    const getAnnex = (annex) => {
        toggleModalLoading(true)
        setAnnexType(annex.contract_type)
        handleRequest(AnnexesService.getItem(annex.id))
        .then(({ body }) => {
            toggleAnnexModal(true)
            setSelectedAnnex(body)
            toggleModalLoading(false)
        })
    }

    const getOverviews = () => {
        handleRequest(
            AnnexesService.getStateCounts({ annex_created_after: filters.annex_created_after, annex_created_before: filters.annex_created_before})
        ).then(res => {
            if (res.body) {
                const updatedOverviews = overviews.map( o => {
                    if (o.id === 1) return { ...o, count: res.body.vat_free}
                    if (o.id === 2) return { ...o, count: res.body.with_vat}
                    if (o.id === 3) return { ...o, count: res.body.in_process}
                    if (o.id === 4) return { ...o, count: res.body.approved}
                    if (o.id === 5) return { ...o, count: res.body.canceled}
                })
                setOverviews(updatedOverviews)
                setAllCount(res.body.all_count)
            }
        })
    }


    const handleAddAnenx = vals => {
        return handleRequest(
            ContractsService.createAnnex({...vals, request_no: vals.request_no || null})
        ).then(() => {
          getOverviews()
        })
    }


    return (
        <PageContent
            title="Müqaviləyə əlavə"
            titleIcon={<AttachFileIcon />}
            overviewCards={overviews}
            sum={allCount}
            onExportCSV={() => dt.current.exportCSV()}
            showTimeRange
            handleFilter={({from, to}) =>  setFilters({ ...filters, "annex_created_after": from , "annex_created_before" : to })}
            data={annexes}
            columns={columns}
        >
             <ExtendedTable
                headerTitle="Müqaviləyə əlavələrin siyahısı"
                data={annexes}
                loading={loading}
                columns={columns}
                elRef={dt}
                enqueueSnackbar={enqueueSnackbar}
                getData={getAnnexes}
                getItem={getAnnex}
                filters={filters}
                setFilters={setFilters}
                tableLoading={tableLoading}
                annexStatus
                statuses={annexStatuses}
                isAnnex
            />
                {
                annexModal ? (
                    <ContractAnnexModal
                        open={true}
                        handleClose={() => {
                            toggleAnnexModal(false)
                            setSelectedAnnex(null)
                        }}
                        handleSubmit={handleAddAnenx}
                        handleRequest={handleRequest}
                        formType={annexType}
                        salesManagers={salesManagers}
                        sellers={sellers}
                        units={units}
                        reloadData={() => getAnnexes(filters)}
                        modalLoading={modalLoading}
                        selectedAnnex={selectedAnex}
                        annexType={annexType}

                    />
                ) : null
            }

        </PageContent>
    )
}


export default Annexes;