import React, { useState, useEffect, useRef }  from "react";
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import OverviewBox from "./OverviewBox";
import { Calendar } from 'primereact/calendar';
import { format } from 'date-fns'

import './styles.scss';




const PageContent = ({overviewCards, title, titleIcon, sum, addIcon, children, onExportCSV, onExportPDF, showTimeRange, handleFilter }) => {
  const [from, setFrom ] = useState();
  const [to, setTo] = useState();
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

 useEffect(() => {
   if (handleFilter && firstRender.current)
      handleFilter({from, to })
 }, [from, to])

  const handleFilterChange = (e, field) => {
    if (!firstRender.current )
      firstRender.current = true
      if (field === "from")
        setFrom( e.value ? format(e.value, "yyyy-MM-dd") : null)
      else
        setTo( e.value ? format(e.value, "yyyy-MM-dd") : null)
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
                            <Calendar id="from" value={from} onChange={e => handleFilterChange(e, "from") }  />
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
            <Grid item key={overview.id} lg={Math.round(12/overviewCards.length)} md={Math.round(12/overviewCards.length)}  sm={6} xs={12}>
              <OverviewBox  {...overview} />
            </Grid>
          )): null}
      </Grid>
    <Grid container spacing={3} >
      <Grid item md={6} sm={12} className="content-header">
        <h3>{`Ümumi say: ${sum}`}</h3>
      </Grid>
      <Grid item md={6}  className="content-toolbar" >
        <Grid container spacing={0}>
          <Grid item md={12} className="align-right">
            {addIcon}
              <Tooltip title="CSV formatında yüklə" placement="top"  >
                  <IconButton onClick={onExportCSV} className="csv-icon">
                      <GetAppIcon />
                  </IconButton>
              </Tooltip>
              &nbsp;&nbsp;
              <Tooltip title="PDF formatında yüklə" placement="top"  >
                  <IconButton  onClick={onExportPDF} className="pdf-icon" >
                      <PictureAsPdfIcon />
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


export  default PageContent;