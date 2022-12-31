import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container } from '@mui/material';
import AppWebsiteVisits from 'src/sections/@dashboard/app/AppWebsiteVisits';
import AppConversionRates from 'src/sections/@dashboard/app/AppConversionRates';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeLoading, showLoading } from 'src/redux/slices/LoadingSlice';
import axios from 'axios';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import { useNavigate } from 'react-router-dom';
import { statisticAPI } from 'src/api/ConfigAPI';
import Loading from 'src/components/loading/Loading';
import MONTHS from '../enums/months'
// components
// sections

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const { loading } = useSelector(state => {
    return {
      loading: state.loading.value
    }
  })
  const [myRevenue, setMyRevenue] = useState(null)
  const [topSoldProducts, setTopSoldProducts] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(showLoading());
    Promise.all([statisticAPI.getRevenue(), statisticAPI.getTopSoldProducts()])
      .then((results) => {
        const data = results[0].data
        const revenue = Object.values(data.revenue)
        const costPrice = Object.values(data.costPrice)
        const gap = Object.values(data.gap)
        setMyRevenue({ revenue, costPrice, gap });
        setTopSoldProducts(results[1].data)
      })
      .catch((error) => {
        if (axios.isAxiosError(error))
          dispatch(setErrorValue(error.response ? error.response.data.message : error.message));
        else dispatch(setErrorValue(error.toString()));
        navigate("/error")
      })
      .finally(() => {
        dispatch(closeLoading());
      })
  }, [])

  return (
    loading ?
      <Loading /> :
      <>
        <Helmet>
          <title> Tổng quát </title>
        </Helmet>

        <Container maxWidth="xl">

          <Grid container spacing={3}>

            <Grid item xs={12} md={12} lg={12}>
              <AppWebsiteVisits
                title="Doanh thu trong năm"
                // subheader="(+43%) than last year"
                chartLabels={Object.values(MONTHS)}
                chartData={[
                  {
                    name: 'Doanh thu',
                    type: 'column',
                    fill: 'solid',
                    data: myRevenue?.revenue,
                  },
                  {
                    name: 'Chi phí bỏ ra',
                    type: 'area',
                    fill: 'gradient',
                    data: myRevenue?.costPrice
                  },
                  {
                    name: 'Chênh lệch',
                    type: 'none',
                    data: myRevenue?.gap,
                  },
                ]}
              />
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <AppConversionRates
                title="Top sản phẩm bán chạy trong tháng"
                chartData={topSoldProducts}
              />
            </Grid>
          </Grid>
        </Container>
      </>
  );
}
