import React from 'react';
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Token } from "@uniswap/sdk";

import { useActiveWeb3React } from "../../hooks";
import CurrencyText from "../CurrencyText";
import CurrencyLogo from "../CurrencyLogo";
import styled from "styled-components";

const CustomTitle = styled.h4`
  color: ${({theme}) => theme.text2}
`

const CustomText = styled.span`
  color: ${({theme}) => theme.text1}
`

const AssetModal = (props) => {
    const { chainId } = useActiveWeb3React();
    const overview = useSelector(state => state.balances.overview);
    const asset = props.match.params.asset;

    const onHide = () => {
        props.history.push('/dashboard');
    }

    if(overview[asset] === undefined) {
        onHide();
    }

    let data = overview[asset] ? overview[asset].balances : [];

    return (
        <Modal
            size={'lg'}
            show={true}
            centered={true}
            className={'assets'}
            onHide={onHide}>
            <Modal.Header className={'border-0'}>
                <Modal.Title>
                    <CustomTitle>{overview[asset].title || 'Assets'}</CustomTitle>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={'py-3'}>
                <div>
                    <table className="table table-borderless mb-0 table-head-custom ">
                        <thead>
                            <th>Assets</th>
                            <th>Balance</th>
                            <th className={'assets__value--right'}>Value</th>
                        </thead>
                        <tbody>
                        {data.map(row => {
                            if(row.underlying.length > 0) {
                                return row.underlying.map(uRow => {
                                    const currency = new Token(chainId, uRow.metadata.address, uRow.metadata.decimals, uRow.metadata.symbol, uRow.metadata.name);
                                    return (
                                        <tr key={uRow.metadata.address} className={'assets__row'}>
                                            <td>
                                                <CurrencyLogo currency={currency} size={'36px'}/>
                                                <CustomText className={'font-weight-boldest assets__title ml-4'}>{uRow.metadata.name}</CustomText>
                                            </td>
                                            <td className={'assets__value'}>
                                                <CustomText>
                                                    {(uRow.balance / 10 ** uRow.metadata.decimals).toFixed(6)}
                                                </CustomText>
                                            </td>
                                            <td className={'assets__value assets__value--right'}>
                                                <CustomText>
                                                    <CurrencyText>{uRow.balanceUSD}</CurrencyText>
                                                </CustomText>
                                            </td>
                                        </tr>
                                    )
                                })
                            } else {
                                const currency = new Token(chainId, row.base.metadata.address, row.base.metadata.decimals, row.base.metadata.symbol, row.base.metadata.name);
                                return (
                                    <tr key={row.base.metadata.address} className={'assets__row'}>
                                        <td>
                                            <CurrencyLogo currency={currency} size={'36px'}/>
                                            <CustomText className={'font-weight-boldest assets__title ml-4'}>{row.base.metadata.name}</CustomText>
                                        </td>
                                        <td className={'assets__value'}>
                                            <CustomText>
                                                {(row.base.balance / 10 ** row.base.metadata.decimals).toFixed(6)}
                                            </CustomText>
                                        </td>
                                        <td className={'assets__value assets__value--right'}>
                                            <CustomText>
                                                <CurrencyText>{row.base.balanceUSD}</CurrencyText>
                                            </CustomText>
                                        </td>
                                    </tr>
                                )
                            }
                        })}
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer className={'py-3 px-5 border-0'}>
                <button className="btn btn-light" onClick={onHide}>Close</button>
            </Modal.Footer>
        </Modal>
    )
}

export default AssetModal