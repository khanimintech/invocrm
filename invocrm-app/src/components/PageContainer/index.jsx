import React  from "react";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import './styles.scss';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

import OverviewBox from "./OverviewBox";


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    headerRow: {
        "h1": {
            display: "inline-block"
        }
    }
  }));





const PageContent = ({overviewCards, title, titleIcon, sum, addIcon, children, onExportCSV, onExportPDF}) => {
    return (
    <>
      <Grid container spacing={3}>
          <Grid item xs={12} md={12} className="header-row" >
              {titleIcon}
              &nbsp;
              <h1>{title}</h1>
          </Grid>
      </Grid>
      <Grid container spacing={3} justify="space-between" >
          {overviewCards.map(overview => (
            <Grid item key={overview.id} lg={Math.round(12/overviewCards.length)} md={Math.round(12/overviewCards.length)}  sm={6} xs={12}>
              <OverviewBox  {...overview} />
            </Grid>
          ))}
      </Grid>
    <Grid container spacing={3} >
      <Grid item md={6} sm={12} className="content-header">
        <h3>{`Umumi say: ${sum}`}</h3>
      </Grid>
      <Grid item md={6}  className="content-toolbar" justify="flex-end">
      {addIcon}
        <Tooltip title="CSV formatinda yukle" placement="top"  >
            <IconButton onClick={onExportCSV} className="csv-icon">
                <GetAppIcon  fontSize="medium"/>
            </IconButton>
        </Tooltip>
        &nbsp;&nbsp;
        <Tooltip title="CSV formatinda yukle" placement="top"  >
            <IconButton  onClick={onExportPDF} className="pdf-icon" >
                <PictureAsPdfIcon fontSize="medium" />
            </IconButton>
        </Tooltip>
      </Grid>
    </Grid>

  
    <Grid container spacing={3}>
      {children}
    </Grid>
  </>
    )
}


export  default PageContent;