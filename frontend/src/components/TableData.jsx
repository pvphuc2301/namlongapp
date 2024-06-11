import { Checkbox, Empty, Flex, Input, InputNumber, Space, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

const StyledTable = styled.table`

`;

const StyledHeader = styled.thead`
    position: sticky;
    top: 0;
    z-index: 99;

`;

const StyledBody = styled.tbody`

`;

const StyledRow = styled.tr`
    border-bottom: 1px solid #f0f0f0;

    &:hover {
        background-color: #f5f5f5;
    }

    &.selected {
        background-color: #e6f4ff;
    }

    &.selected:hover {
        background-color: #cee4f5;
    }
`;

const StyledHeaderCell = styled.th`
    padding: 8px;
    position: relative;
    color: rgba(0, 0, 0, 0.88);
    font-weight: 600;
    background: #fafafa;
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.2s ease;

    &:not(:last-child) {
        /* border-right: 1px solid #f0f0f0; */
        &::before {
            position: absolute;
            content: '';
            inset-inline-end: 0;
            background-color: #f0f0f0;
            width: 1px;
            height: 1.6em;
        }
    }
`;

const StyledCell = styled.td`
    padding: 4px 8px;
`;

const StyledSorter = styled.span`
    cursor: pointer;
    display: flex;
    align-items: center;
    flex-grow: 1;
    justify-content: space-between;
    gap: 4px;
    width: max-content;
`;

const StyledFilter = styled.div`
    position: relative;
    display: inline-block;
    
    & .filter__icon {
        cursor: pointer;
    }

    &:has(.is-filtered) > .filter__icon  {
        color: #1677ff;
    }

    &:not(.active) > .filter__container {
        display: none;
    }
`;

const StyledTableFilterSearch = styled.div`
    padding: 8px;
    margin-bottom: 8px;
    border-bottom: 1px solid #eee;
`;

const StyledFilterContainer = styled.div`
    position: absolute;
    width: 100%;
    /* position: fixed; */
    /* top: 100%;
    left: 0; */
    /* border: 1px solid black; */
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    padding: 10px 0;
    background-color: #fff;
    z-index: 10;
    border-radius: 6px;

    width: max-content;

    & .filter__menu {
        border-bottom: 1px solid #eee;
        list-style: none;
        margin: 8px 0;
        padding: 0;
        max-height: 250px;
        overflow-y: auto;
    }
`;

const StyledFilterMenuItem = styled.div`
    cursor: pointer;
    padding: 4px;
    margin: 4px 8px;
    border-radius: 4px;
    
    &:hover {
        background-color: #eee;
    }

    &.active {
        background-color: #eee;

        &:hover {
            background-color: #e0e0e0;
        }
    }
`;

export const StyledTableOperation = styled.div`
    width: max-content;

`;

const TableData = (
    {
        columns,
        data,
        rowSelection,
        renderRow
    }
) => {
    const checkboxRef = useRef();

    const { selectedRowKeys, onChange } = rowSelection;
    const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;
    const isSelectedAll = selectedRowKeys.length > 0 && selectedRowKeys.length === data.length;

    const [filter, setFilter] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const sortField = searchParams.get("sortBy") || "-";

    const handleFilterClick = (column, filter, value) => (e) => {
        e.stopPropagation();
        column.filter.onFilter?.(searchParams);
        setSearchParams({ ...Object.fromEntries([...searchParams]), [filter]: value });
        setFilter(null);
    }

    const handleSorterClick = (column, dir) => (e) => {
        e.stopPropagation();
        let [_, direction] = sortField?.split('-');
        direction = dir ? dir : direction === 'asc' ? 'desc' : 'asc';
        setSearchParams({ ...Object.fromEntries([...searchParams]), [`sortBy`]: `${column.sorter}-${direction}` });
    }

    const [searchValue, setSearchValue] = useState('');
    const searchInput = [useRef(), useRef()];

    const [searchParams2, setSearchParams2] = useState({});

    useEffect(() => {
        columns?.forEach(column => {
            if (column.filter) {
                setSearchParams2(pre => ({ ...pre, [column.filter.filterIndex]: searchParams.get(column.filter.filterIndex) }));
            }
        })
    }, [searchParams]);

    const renderFilterContent = (column, filterData) => {
        const options = column.filter?.options?.filter(filter => filter.text.toLowerCase().includes(searchValue));

        const map = {
            'text-contains': (
                <StyledTableFilterSearch>
                    <Input name={column.filter.filterIndex}
                        value={searchParams2[column.filter.filterIndex]}
                        onChange={e => setSearchParams2({ ...searchParams2, [column.filter.filterIndex]: e.target.value })} />
                </StyledTableFilterSearch>
            ),
            'number-between': (
                <StyledTableFilterSearch>
                    <Space.Compact block>
                        <InputNumber
                            value={searchParams2[`${column.filter.filterIndex}f`]}
                            onChange={value => setSearchParams2({ ...searchParams2, [`${column.filter.filterIndex}f`]: value })}
                            name={`${column.filter.filterIndex}f`}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                            style={{ width: '100%' }}
                        />

                        <InputNumber
                            value={searchParams2[`${column.filter.filterIndex}t`]}
                            onChange={value => setSearchParams2({ ...searchParams2, [`${column.filter.filterIndex}t`]: value })}
                            name={`${column.filter.filterIndex}t`}
                            ref={searchInput[1]}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                            style={{ width: '100%' }}
                        />
                    </Space.Compact>
                </StyledTableFilterSearch>
            ),
            'selection-eq': (
                <>
                    <StyledTableFilterSearch>
                        <Input prefix={<i className="bi bi-search"></i>}
                            onPressEnter={(e) => {
                                e.preventDefault();
                                setSearchValue(e.target.value);
                            }} />
                    </StyledTableFilterSearch>
                    {
                        <menu className="filter__menu">
                            {
                                !options?.length ? <Empty /> :
                                    options?.map((filter, index) => {
                                        const className = filterData == filter.value ? 'active' : '';
                                        return (
                                            <StyledFilterMenuItem
                                                key={index}
                                                className={className}
                                                onClick={handleFilterClick(column, column.filter.filterIndex, filter.value)}>
                                                {filter.text}
                                            </StyledFilterMenuItem>)
                                    })}
                        </menu>
                    }
                </>)

        }

        return map[`${column.filter.type}-${column.filter.condition}`];
        // if (column.filter?.type === filterType.text) {
        //     if (searchInput.current) searchInput.current.value = filterData;
        //     return <StyledTableFilterSearch>
        //         <Input ref={searchInput} prefix={<i className="bi bi-search"></i>} onPressEnter={(e) => {
        //             handleFilterClick(column, { value: e.target.value })(e);
        //         }} />
        //     </StyledTableFilterSearch>
        // } else if (column.filter?.type === filterType.selection) {
        //     if (!column.filter?.options) return null;

        //     const options = column.filter.options.filter(filter => filter.text.toLowerCase().includes(searchValue));

        //     return (
        //         <><StyledTableFilterSearch>
        //             <Input prefix={<i className="bi bi-search"></i>} onPressEnter={(e) => setSearchValue(e.target.value)} />
        //         </StyledTableFilterSearch>
        //             {
        //                 <menu className="filter__menu">
        //                     {options.map(filter => {
        //                         const className = filterData == filter.value ? 'active' : '';
        //                         return (
        //                             <StyledFilterMenuItem
        //                                 className={className}
        //                                 onClick={handleFilterClick(column, filter)}>
        //                                 {filter.text}
        //                             </StyledFilterMenuItem>)
        //                     })}
        //                 </menu>
        //             }
        //         </>)
        // } else if (column.filter?.type === filterType.number) {
        //     if (searchInput.current) searchInput.current.value = filterData;
        //     return <StyledTableFilterSearch>
        //         <Input ref={searchInput} prefix={<i className="bi bi-search"></i>} onPressEnter={(e) => {
        //             handleFilterClick(column, { value: e.target.value })(e);
        //         }} />
        //     </StyledTableFilterSearch>
        // }
    }

    const renderHeaderSorter = (column, index) => {
        if (!column.sorter) return column.title;

        const sortDir = sortField?.split('-')?.[1];

        return (
            <Tooltip placement="top" title={'Click to sort'}>
                <StyledSorter onClick={handleSorterClick(column)}>
                    {column.title}
                    {sortField?.split('-')?.[0] === column.dataIndex &&
                        (sortDir &&
                            <span style={{ display: 'inline-flex', flexDirection: 'column' }}>
                                <i style={{ height: '10px', lineHeight: '10px', color: sortDir === 'asc' ? '#1677ff' : '#d3d3d3' }}
                                    className='bi bi-caret-up-fill'></i>
                                <i style={{ height: '10px', lineHeight: '10px', color: sortDir === 'desc' ? '#1677ff' : '#d3d3d3' }}
                                    className='bi bi-caret-down-fill'></i>
                            </span>
                        )}
                </StyledSorter>
            </Tooltip>
        )
    }

    const renderCheckbox = (row) => {
        const { id } = row;
        const checked = selectedRowKeys?.includes(id);

        return (
            <StyledCell>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Checkbox ref={checkboxRef} id={`user_${id}`} checked={checked} onChange={(e) => {
                        onChange?.(e.target.checked ? [...selectedRowKeys, id] : selectedRowKeys.filter(selectedId => selectedId !== id))
                    }}
                    />
                </div>
            </StyledCell>
        )
    }

    const handleSelectAll = (e) => {
        const { checked } = e.target;

        if (isIndeterminate || checked) {
            onChange?.([...data.map(item => item.id)]);
        } else {
            onChange?.([]);
        }
    }

    return (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 255px)' }}>
            <StyledTable>
                <StyledHeader>
                    <StyledRow>
                        <StyledHeaderCell>
                            <Checkbox indeterminate={isIndeterminate}
                                checked={isSelectedAll}
                                id="select-all"
                                ref={checkboxRef}
                                onChange={handleSelectAll} />
                        </StyledHeaderCell>
                        {columns.map((column, index) => {
                            return (
                                <StyledHeaderCell key={index}>
                                    <Flex justify="space-between" align="center" gap={8}>
                                        {renderHeaderSorter(column, index)}
                                        {/* {renderFilters(column, index)} */}
                                    </Flex>
                                </StyledHeaderCell>
                            )
                        })}
                    </StyledRow>
                </StyledHeader>
                <StyledBody>
                    {!data?.length ? (
                        <StyledRow>
                            <StyledCell colSpan={columns.length}><Empty /></StyledCell>
                        </StyledRow>
                    ) :
                        data?.map(row => {

                            return (
                                <>
                                    <StyledRow className={selectedRowKeys.includes(row.id) ? 'selected' : ''} key={row.id}>
                                        {renderCheckbox(row)}
                                        {
                                            columns.map((column, index) => {
                                                if (column.render) {
                                                    return (
                                                        <StyledCell key={index}>
                                                            {column.render(row[column.dataIndex], row)}
                                                        </StyledCell>
                                                    );
                                                }
                                                return (
                                                    <StyledCell key={index}>
                                                        {row[column.dataIndex]}
                                                    </StyledCell>
                                                )
                                            })}
                                    </StyledRow>

                                    {renderRow && renderRow(row, (subRows) => <div>
                                        {
                                            subRows?.map((subRow, index) => {
                                                return (
                                                    <StyledRow className={selectedRowKeys.includes(subRow.id) ? 'selected' : ''} key={subRow.id}>
                                                        {/* {renderCheckbox(subRow)} */}
                                                        <StyledCell>
                                                            {
                                                                subRow.projectName
                                                            }
                                                        </StyledCell>
                                                    </StyledRow>
                                                )
                                            })

                                        }
                                    </div>)}
                                </>
                            )
                        })}
                </StyledBody>
            </StyledTable>
        </div>
    );
}

export default TableData;