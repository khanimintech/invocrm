import React, { useState, useRef, useEffect } from 'react';
import PageContent from '../../components/PageContainer';
import DescriptionIcon from '@material-ui/icons/Description';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { ContractsService } from '../../services/ContractsService';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PostAddIcon from '@material-ui/icons/PostAdd';
import ExtendedTable from '../../components/ExtendedTable';
import { ITEM_HEIGHT } from '../../constants';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './styles.scss';


const initialOverviews = [
    { id: 1, status: "Vaxtı bitən", count: 0, icon: <PriorityHighIcon />, color: "#42A5F5" },
    { id: 2, status: "Vaxtı bitməyinə 2 həftə qalan", count: 0, icon: <AccessAlarmIcon />, color: "#7E57C2" },
    { id: 3, status: "Prosesdə", count: 0, icon: <HourglassEmptyIcon />, color: "#FFB300" },
    { id: 4, status: "Təsdiqlənib", count: 0, icon: <CheckCircleIcon />, color: "#66BB6A" },
]

const columns = [
    { field: 'company_name', header: 'Şirkət' },
    { field: 'contract_id', header: 'Müqavilə Nömrəsi' },
    { field: 'type', header: 'Müqavilə Növü' },
    { field: 'created', header: 'Yaradılma Tarixi' },
    { field: 'end_date', header: "Bitmə Tarixi" },
    { field: 'sales_name', header: "Satış Meneceri" },
    { field: 'status', header: 'Status' },
    { field: 'executor', header: "İcraçı" },
    { field: 'annex_count', header: "Elave sayi" },
];


const Contracts = ({ handleRequest, user, loading, enqueueSnackbar }) => {

    let dt = useRef(null);
    const [overviews, setOverviews] = useState(initialOverviews);
    const [contracts, setContracts] = useState(null);
    const [statuses, setStatuses] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openCreateMenu = Boolean(anchorEl);



    useEffect(() => {
        getContracts();
    }, [])


    const getContracts = () => {
        handleRequest(
            ContractsService.index()
        ).then(res => {
            setContracts(res.body.data)
            setStatuses(res.body.data.map(contract => contract.status))
        })
    }

    const deleteContract = (contract) => handleRequest(ContractsService.remove(contract.id));

    const exportPDF = () => {
        const el = document.getElementsByClassName("p-datatable-wrapper")[0].cloneNode(true);
        html2canvas(el)
        .then((canvas) => {
            let img = new Image();
            img.src = canvas.toDataURL('image/png');
            img.onload = function () {
              let pdf = new jsPDF({
                orientation: "landscape",
                unit: "in",
                format: [8, 4]
              });
              pdf.addImage(img, 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
              pdf.save('contracts.pdf');
            };
        })
    }

    const addIcon = (
        <>
            <Tooltip title="Sened yarat" placement="top-end">
                <IconButton
                    aria-label="elave"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={event => setAnchorEl(event.currentTarget)}
                    className="add-icon"
                >
                    <PostAddIcon fontSize="medium" />
                </IconButton>
            </Tooltip>

            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={openCreateMenu}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >

                <MenuItem onClick={event => setAnchorEl(event.currentTarget)}>
                    Alqı-satqı
                </MenuItem>
                <MenuItem onClick={event => setAnchorEl(event.currentTarget)}>
                    Xidmət
                </MenuItem>
                <MenuItem onClick={event => setAnchorEl(event.currentTarget)}>
                    Agent
                </MenuItem>
                <MenuItem onClick={event => setAnchorEl(event.currentTarget)}>
                    Distribyutor
                </MenuItem>
            </Menu>
        </>
    )



    return (
        <PageContent
            title="Müqavilələr"
            titleIcon={<DescriptionIcon />}
            overviewCards={overviews}
            sum={contracts ? contracts.length : 0}
            onExportCSV={() => dt.current.exportCSV()}
            addIcon={addIcon}
            onExportPDF={exportPDF}
        >
            <ExtendedTable
                headerTitle="Müqavilələrin siyahısı"
                data={contracts}
                loading={loading}
                columns={columns}
                statuses={statuses}
                elRef={dt}
                actions={{ edit: true, delete: true, attach: true, plus: true}}
                enqueueSnackbar={enqueueSnackbar}
                onDelete={deleteContract}
                getData={getContracts}
            />

        </PageContent>
    )
}


export default Contracts;