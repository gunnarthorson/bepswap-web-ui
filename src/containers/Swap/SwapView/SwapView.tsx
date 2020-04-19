import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { SyncOutlined, SwapOutlined } from '@ant-design/icons';

import { util } from 'asgardex-common';
import Label from '../../../components/uielements/label';
import CoinButton from '../../../components/uielements/coins/coinButton';
import CoinPair from '../../../components/uielements/coins/coinPair';
import Trend from '../../../components/uielements/trend';
import Button from '../../../components/uielements/button';
import Table from '../../../components/uielements/table';
import SwapLoader from '../../../components/utility/loaders/swap';

import { getSwapData } from '../utils';
import { SwapTableRowType, SwapCardType } from './types';
import * as midgardActions from '../../../redux/midgard/actions';
import { PriceDataIndex, PoolDataMap } from '../../../redux/midgard/types';
import { FixmeType, Maybe, ViewType, Nothing } from '../../../types/bepswap';

import { ContentWrapper } from './SwapView.style';
import { RootState } from '../../../redux/store';
import { getAssetFromString } from '../../../redux/midgard/utils';
import { PoolInfoType } from '../../Pool/types';

type ComponentProps = {};

type ConnectedProps = {
  pools: string[];
  poolData: PoolDataMap;
  priceIndex: PriceDataIndex;
  basePriceAsset: string;
  loading: boolean;
  getPools: typeof midgardActions.getPools;
};

type Props = ComponentProps & ConnectedProps;

const SwapView: React.FC<Props> = (props): JSX.Element => {
  const {
    pools,
    poolData,
    priceIndex,
    basePriceAsset,
    loading,
    getPools,
  } = props;

  const [activeAsset, setActiveAsset] = useState('rune');

  useEffect(() => {
    getPools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderSwapTable = (
    swapViewData: SwapTableRowType[],
    view: ViewType,
  ) => {
    const btnCol = {
      key: 'swap',
      title: (
        <Button onClick={getPools} typevalue="outline">
          <SyncOutlined />
          refresh
        </Button>
      ),
      render: (text: string, record: SwapTableRowType) => {
        const {
          pool: { asset, target },
        } = record;
        const URL = `/swap/detail/${asset.toLowerCase()}-${target.toLowerCase()}`;
        const dataTest = `swap-button-${target.toLowerCase()}`;

        return (
          <Link to={URL}>
            <Button
              style={{ margin: 'auto' }}
              round="true"
              data-test={dataTest}
            >
              <SwapOutlined />
              swap
            </Button>
          </Link>
        );
      },
    };

    const mobileColumns = [
      {
        key: 'pool',
        title: 'pool',
        dataIndex: 'pool',
        render: ({ asset, target }: PoolInfoType) => (
          <CoinPair from={asset} to={target} />
        ),
      },
      btnCol,
    ];

    const desktopColumns = [
      {
        key: 'pool',
        title: 'pool',
        dataIndex: 'pool',
        render: ({ asset, target }: PoolInfoType) => (
          <CoinPair from={asset} to={target} />
        ),
      },
      {
        key: 'asset',
        title: 'asset',
        dataIndex: 'pool',
        render: ({ target }: { target: string }) => <p>{target}</p>,
        sorter: (a: SwapTableRowType, b: SwapTableRowType) =>
          a.pool.target.localeCompare(b.pool.target),
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'poolprice',
        title: 'pool price',
        dataIndex: 'poolPrice',
        sorter: (a: SwapTableRowType, b: SwapTableRowType) =>
          a.raw.poolPrice.minus(b.raw.poolPrice), // TODO(Veado): Does it work for sorting BN?
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
      },
      {
        key: 'depth',
        title: 'depth',
        dataIndex: 'depth',
        sorter: (a: SwapTableRowType, b: SwapTableRowType) =>
          a.raw.depth.minus(b.raw.depth), // TODO(Veado): Does it work for sorting BN?
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'vol',
        title: '24h vol',
        dataIndex: 'volume',
        sorter: (a: SwapTableRowType, b: SwapTableRowType) =>
          a.raw.volume.minus(b.raw.volume), // TODO(Veado): Does it work for sorting BN?
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'transaction',
        title: 'avg. transaction',
        dataIndex: 'transaction',
        sorter: (a: SwapTableRowType, b: SwapTableRowType) =>
          a.raw.transaction.minus(b.raw.transaction), // TODO(Veado): Does it work for sorting BN?
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'slip',
        title: 'avg. slip',
        dataIndex: 'slip',
        render: (slip: string) => <Trend amount={util.bn(slip)} />,
        sorter: (a: SwapTableRowType, b: SwapTableRowType) =>
          a.raw.slip.minus(b.raw.slip), // TODO(Veado): Does it work for sorting BN?,
        sortDirections: ['descend', 'ascend'],
      },
      {
        key: 'trade',
        title: 'no. of trades',
        dataIndex: 'trade',
        sorter: (a: SwapTableRowType, b: SwapTableRowType) =>
          a.raw.trade.minus(b.raw.trade), // TODO(Veado): Does it work for sorting BN?,
        sortDirections: ['descend', 'ascend'],
      },
      btnCol,
    ];

    const columnData: { desktop: FixmeType; mobile: FixmeType } = {
      desktop: desktopColumns,
      mobile: mobileColumns,
    };
    const columns = columnData[view] || desktopColumns;

    return <Table columns={columns} dataSource={swapViewData} rowKey="key" />;
  };

  const renderSwapList = (view: ViewType) => {
    let key = 0;
    const swapViewData = pools.reduce((result: FixmeType[], pool) => {
      const { symbol } = getAssetFromString(pool);
      const poolInfo = symbol ? poolData[symbol] : Nothing;

      const swapCardData: Maybe<SwapCardType> = getSwapData(
        'rune',
        poolInfo,
        priceIndex,
        basePriceAsset,
      );

      if (swapCardData && swapCardData.pool.target !== activeAsset) {
        result.push({ ...swapCardData, key });
        key += 1;
      }

      return result;
    }, []);

    return renderSwapTable(swapViewData, view);
  };

  const renderAssets = () => {
    const asset = 'rune';
    const runePrice = util.validBNOrZero(priceIndex?.RUNE);

    return (
      <CoinButton
        cointype={asset}
        onClick={() => {
          setActiveAsset(asset);
        }}
        focused={asset === activeAsset}
        disabled={asset !== 'rune'} // enable only rune for base pair
        price={runePrice}
        priceUnit={basePriceAsset}
        key={0}
      />
    );
  };

  return (
    <ContentWrapper className="swap-view-wrapper">
      {loading && <SwapLoader />}
      {!loading && (
        <>
          <div className="view-title">
            <Label size="normal" weight="bold" color="normal">
              CHOOSE BASE PAIR
            </Label>
          </div>
          <div className="asset-button-group">{renderAssets()}</div>
          <div className="swap-list-view desktop-view">
            {renderSwapList(ViewType.DESKTOP)}
          </div>
          <div className="swap-list-view mobile-view">
            {renderSwapList(ViewType.MOBILE)}
          </div>
        </>
      )}
    </ContentWrapper>
  );
};

export default compose(
  connect(
    (state: RootState) => ({
      pools: state.Midgard.pools,
      poolData: state.Midgard.poolData,
      priceIndex: state.Midgard.priceIndex,
      basePriceAsset: state.Midgard.basePriceAsset,
      loading: state.Midgard.poolLoading,
    }),
    {
      getPools: midgardActions.getPools,
    },
  ),
  withRouter,
)(SwapView) as React.FC<ComponentProps>;
