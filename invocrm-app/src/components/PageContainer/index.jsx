import React, { useState, useEffect, useRef } from "react";
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import OverviewBox from "./OverviewBox";
import { Calendar } from 'primereact/calendar';
import { format } from 'date-fns'
import { contractStatuses, contractTypes } from "../../constants";
import { formatDateString } from "../../utils";
import 'jspdf-autotable'
import FileSaver from 'file-saver';
import { jsPDF } from "jspdf";
import xlsx from 'xlsx';
import PrintIcon from '@material-ui/icons/Print';
import html2canvas from "html2canvas";
import './styles.scss';
import { CircularProgress } from "@material-ui/core";
import ExtendedTable from "../ExtendedTable";




class ComponentToPrint extends React.Component {
	render({data, columns, elRef}) {
	  return (
		<ExtendedTable
                data={data}
                columns={columns}
                statuses={contractStatuses}
				elRef={elRef}

            />
	  );
	}
  }


const PageContent = ({ 
	overviewCards, title, titleIcon, sum, addIcon, children,
 showTimeRange, handleFilter, data, columns
}) => {
	const [from, setFrom] = useState();
	const [to, setTo] = useState();
	const [pdfLoading, togglePdfLoading] = useState(false);

	const firstRender = useRef(true);

	const options = {
		orientation: 'landscape',
		unit: 'in',
		format: [4,2]
	};

	useEffect(() => {
		firstRender.current = false;
	}, []);

	useEffect(() => {
		if (handleFilter && firstRender.current)
			handleFilter({ from, to })
	}, [from, to])

	const handleFilterChange = (e, field) => {
		if (!firstRender.current)
			firstRender.current = true
		if (field === "from")
			setFrom(e.value ? format(e.value, "yyyy-MM-dd") : null)
		else
			setTo(e.value ? format(e.value, "yyyy-MM-dd") : null)
	}


	
	const exportExcel = () => {
			try {
				let excelData = data.map(row => {
					let formatedRow = {};
					columns.forEach(col => {
						const { field, header } = col;
						switch (field){
							case "created":
							case "due_date":
							case "annex_date":
								formatedRow[header] = formatDateString(row[field])
								break;
							case "status":
								formatedRow[header] = contractStatuses.find(s => s.value === row[field]) ? contractStatuses.find(s => s.value === row[field]).label : "-"
								break;
							case  "type" :
							case "contract_type":
								formatedRow[header] = contractTypes[row[field]];
								break;
							default:
								formatedRow[header] = row[field] || ""
								break;
						}
					})
					return formatedRow
				})
				const worksheet = xlsx.utils.json_to_sheet(excelData);
				const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
				const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
				saveAsExcelFile(excelBuffer, title);
			}
			catch(e) {
				console.error("Something went wrong")
				console.log(e)
			}
    }

    const saveAsExcelFile = (buffer, fileName) => {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data = new Blob([buffer], {
                type: EXCEL_TYPE
            });
            FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

	const exportPdf = () => {
		togglePdfLoading(true)
		const table = document.getElementsByClassName("p-datatable-wrapper")[0]
		window.scrollTo(0,0)
		html2canvas(table, {
			ignoreElements : el => {
			if (el.classList.contains("p-filter-column") 
				|| el.classList.contains("p-sortable-column-icon") 
				|| el.classList.contains("table-actions-row") 
				|| el.classList.contains("actions-th"))
				return true
			else return false
		},
		letterRendering: 1,
		allowTaint: false,
		useCORS: true,
		onclone: doc => {
			Array.from(doc.getElementsByClassName("status")).forEach(statusEl => {
				statusEl.className = ""
			})
			Array.from(doc.getElementsByClassName("clickable-column")).forEach(statusEl => {
				statusEl.className = ""
			})
			document.getElementsByClassName("p-datatable")[0].getElementsByClassName.maxHeight= "400px";
			document.getElementsByClassName("p-datatable")[0].getElementsByClassName.overflow= "auto";
		},
		scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight
	})
		  .then((canvas) => {
			const imgData = canvas.toDataURL('image/png');
		

			const pdf = new jsPDF({
				orientation: 'p',
				unit: 'ex',
				format: 'b0',
				putOnlyUsedFonts:true,
				backgroundColor: "#ffffff",
				pagesplit: true,
			});
			  pdf.addImage(imgData, 'JPEG', 40, 20);
			togglePdfLoading(false)
			// pdf.autoPrint({variant: 'non-conform'});
			 pdf.save(`${title}.pdf`);
		  })
		;
	
    }

	const  printDocument = ()  => {
		const content = document.getElementsByClassName("p-datatable-wrapper")[0].cloneNode(true);
		Array.from(content.getElementsByClassName("p-filter-column")).forEach(el => {
			el.remove();
		})
		const pri = document.getElementById("ifmcontentstoprint").contentWindow;
		pri.document.open();
		pri.document.write(content.innerHTML);
		pri.document.close();
		pri.focus();
		pri.print();
	}



	return (
		<>
			<Grid container spacing={3} className="page-container-header">
				<Grid item sm={12} md={7} className="header-row" >
					{titleIcon}
              &nbsp; &nbsp;
              <h1>{title}</h1>
				</Grid>
				{
					showTimeRange ? (
						<Grid item className="range-wrapper">
							<div>
								<Calendar id="from" value={from} onChange={e => handleFilterChange(e, "from")} />
								<span >&nbsp;tarixdən&nbsp;&nbsp;</span>
								<Calendar id="to" value={to} onChange={e => handleFilterChange(e, "to")} />
								<span>&nbsp;tarixədək&nbsp;&nbsp;</span>
							</div>
						</Grid>
					) : null
				}
			</Grid>
			<Grid container spacing={3} justify="space-between" >
				{overviewCards ? overviewCards.map(overview => (
					<Grid item key={overview.id} lg={Math.round(12 / overviewCards.length)} md={Math.round(12 / overviewCards.length)} sm={6} xs={12}>
						<OverviewBox  {...overview} />
					</Grid>
				)) : null}
			</Grid>
			<Grid container spacing={3} >
				<Grid item md={6} sm={12} className="content-header">
					<h3>{`Ümumi say: ${sum}`}</h3>
				</Grid>
				<Grid item md={6} className="content-toolbar" >
					<Grid container spacing={0}>
						<Grid item md={12} className="align-right">
							{addIcon}
							<Tooltip title="Excel formatında yüklə" placement="top"  >
								<IconButton onClick={exportExcel} className="csv-icon">
									<GetAppIcon />
								</IconButton>
							</Tooltip>
              					&nbsp;&nbsp;
              					<Tooltip title={pdfLoading ? "PDF generasiya olunur..." : "PDF formatında yüklə"} placement="top"  >
									<IconButton onClick={pdfLoading ? null : exportPdf} className="pdf-icon" >
										{pdfLoading ? <CircularProgress size="small" /> :  <PictureAsPdfIcon /> }	
										</IconButton>
										
									
							</Tooltip>
							&nbsp;&nbsp;
              				<Tooltip title="Çap et" placement="top"  >
							 <IconButton onClick={printDocument} className="pdf-icon" >
									<PrintIcon color="secondary" />
									</IconButton>
								
							</Tooltip>
						</Grid>
					</Grid>
				</Grid>
			</Grid>

			<Grid container spacing={3}>
				{children}
			</Grid>
		</>
	)
}


export default PageContent;