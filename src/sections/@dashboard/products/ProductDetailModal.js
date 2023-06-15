import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { Button, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useState } from 'react';
import Iconify from 'src/components/iconify/Iconify';
import {  benefitValueAPI, productAPI, productBenefitAPI, productPackageAPI } from '../../../api/ConfigAPI';
import CreateProductPackageModal from './createProductPackageModal';
import CreateProductBenefitModal from './CreateProductBenefitModal';
import axios from 'axios';
import { setErrorValue } from 'src/redux/slices/ErrorSlice';
import { useDispatch } from 'react-redux';
import Page from '../../../enums/page';

ProductDetailModal.propTypes = {
    isShow: PropTypes.bool,
    onClose: PropTypes.func,
    product: PropTypes.object,
};

function ProductDetailModal(props) {
    const dispatch = useDispatch();
    const { isShow, onClose, product } = props
    const updateValueRef = useRef(null)
    const [productPackages, setProductPackages] = useState([]);
    const [productBenefits, setProductBenefits] = useState([]);

    const [showCreatePackageForm, setShowCreatePackageForm] = useState(false);
    const [showCreateBenefitForm, setShowCreateBenefitForm] = useState(false);

    function handleCreatePackageFormShow() {
      setShowCreatePackageForm(true);
    }
  
    function handleCloseCreatePackageFormShow() {
      setShowCreatePackageForm(false);
    }

    function handleCreateBenefitFormShow() {
      setShowCreateBenefitForm(true);
    }
  
    function handleCloseCreateBenefitFormShow() {
      setShowCreateBenefitForm(false);
    }
    function handleClose() {
        if (onClose)
            onClose()
    };

    useEffect(
      () => {
        if(!product){
          return;
        }
        async function prepareData() {
          try {
            const resPackages = await productAPI.getPackages(product.id);
            const resBenefits = await productAPI.getBenefits(product.id);

            const productPackages = resPackages.data;
            const benefits = resBenefits.data;
            
            const sortBenefits = benefits.map(benefit => {
              const values = benefit.benefitValues;

              const sortBenefitValues = [];
              for(const productPackage of productPackages){
                const foundValue = values.find(v => v.productPackage.id === productPackage.id)
                sortBenefitValues.push(foundValue);
              }    
              benefit.benefitValues = sortBenefitValues;
              return benefit;
            })
            
            setProductPackages(productPackages)
            setProductBenefits(sortBenefits)
          } catch (error) {
            if (axios.isAxiosError(error))
              alert(error.response ? error.response.data.message : error.message);
            else 
              alert(error.toString());
          }
        }
        prepareData()
      },[product])

    async function handleCreatePackage(data){
      try {
        handleCloseCreatePackageFormShow()
        const resCreatePackage = await productPackageAPI.create(data);
        const newCreatePackage = resCreatePackage.data;
        const newProductPackages = [...productPackages];
        newProductPackages.push(newCreatePackage)
        setProductPackages(newProductPackages);

        const newBenefits = productBenefits.map(benefit => {
          const newValue = newCreatePackage.benefitValues.find(value => value.benefit.id === benefit.id)
          const newBenefitValues = benefit.benefitValues.push(newValue)
          return {
            ...benefit,
            newBenefitValues
          }
        })
        setProductBenefits(newBenefits);
      } catch (error) {
        if (axios.isAxiosError(error))
          dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_PACKAGE}))
        else
          dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_PACKAGE}))
      } finally {
        handleCreatePackageFormShow()
      }
    }

    async function handleCreateBenefit(data){
      try {
        handleCloseCreateBenefitFormShow()
        const res = await productBenefitAPI.create(data);
        const newProductBenefits = [...productBenefits];
        newProductBenefits.push(res.data)

        const sortBenefits = newProductBenefits.map(benefit => {
          const values = benefit.benefitValues;

          const sortBenefitValues = [];
          for(const productPackage of productPackages){
            const foundValue = values.find(v => v.productPackage.id === productPackage.id)
            sortBenefitValues.push(foundValue);
          }    
          benefit.benefitValues = sortBenefitValues;
          return benefit;
        })
        setProductBenefits(sortBenefits);
      } catch (error) {
        if (axios.isAxiosError(error))
          dispatch(setErrorValue({errorMessage: error.response ? error.response.data.message : error.message, page: Page.CREATE_BENEFIT}))
        else
          dispatch(setErrorValue({errorMessage: error.toString(), page: Page.CREATE_BENEFIT}))
      } finally {
        handleCreateBenefitFormShow()
      }
    }

    async function handelUpdateBenefitValue(id, value){
      try {
        await benefitValueAPI.update(id, {value})
        const newBenefits = productBenefits.map(benefit => {
          const foundBenefitValue = benefit.benefitValues.find(b => b.id === id)
          
          if(foundBenefitValue){
            foundBenefitValue.value = value;
            const newBenefitValues = benefit.benefitValues.map(b => b.id === foundBenefitValue.id ? foundBenefitValue : b);
            return {
              ...benefit,
              benefitValues: newBenefitValues
            }
          }
          return benefit;
        })
        setProductBenefits(newBenefits);  
      } catch (error) {
        alert(error)
      } 
    }
  
    return (
      <>
        <Modal size="xl" style={{ zIndex: 10000 }} show={isShow} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{product?.name}</Modal.Title>
              Các gói sản phẩm
          </Modal.Header>
          <Modal.Body>
            <Card>
              <Scrollbar>
                <TableContainer sx={{ minWidth: 1000 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                      <TableCell></TableCell>
                        {
                          productPackages?.map(productPackage => (
                            <TableCell>{productPackage.name}</TableCell>
                          ))
                        }
                        <TableCell>
                          <Button onClick={() => {handleCreatePackageFormShow(true)}} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                            Gói
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        productBenefits?.map(benefit => (
                          <TableRow >
                            <TableCell align="left">{benefit.name}</TableCell>
                            {
                              benefit.benefitValues.map(benefitValue => (
                                <TableCell align="left">
                                  <TextField
                                    variant="standard"
                                    defaultValue={benefitValue.value}
                                    onChange={
                                      (e) => {
                                        if(updateValueRef.current){
                                          clearTimeout(updateValueRef.current)
                                        }

                                        updateValueRef.current = setTimeout(
                                          () => {
                                            handelUpdateBenefitValue(benefitValue.id, e.target.value)
                                          },
                                          300
                                        )

                                      }
                                    }
                                  />
                                </TableCell>
                              ))
                            }
                          </TableRow>
                        ))
                      }
                          <TableRow >
                            <TableCell align="left">
                                <Button onClick={() => {handleCreateBenefitFormShow(true)}} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                                Quyền lợi
                              </Button>
                            </TableCell>
                          </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Card>
          </Modal.Body>
        </Modal>

        <CreateProductPackageModal
          isShow={showCreatePackageForm}
          onClose={() => {
            handleCloseCreatePackageFormShow(false);
          }}
          onSubmit={handleCreatePackage}
          productId={product? product?.id: ''}
        />

        <CreateProductBenefitModal
          isShow={showCreateBenefitForm}
          onClose={() => {
            handleCloseCreateBenefitFormShow(false);
          }}
          onSubmit={handleCreateBenefit}
          productId={product? product?.id: ''}
        />    
      </>
    );
}

export default ProductDetailModal;