import { Button, Card, DatePicker, Input, InputNumber, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { conditionType } from "../utils/constants";

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 8px;
    align-items: end;
`;

const StyledDateInputRange = styled.div`
    display: flex;
    & > div,
    & > div > input {
        width: 100%;
    }

    & > div:first-child {
        border-radius: 6px 0 0 6px
    }

    & > div:last-child {
        border-radius: 0 6px 6px 0
    }
`;

const StyledDateInput = styled.div`
    background: #ffffff;
    border-width: 1px;
    border-style: solid;
    border-color: #d9d9d9;

    box-sizing: border-box;
    margin: 0;
    padding: 4px 11px 4px;
    color: rgba(0, 0, 0, 0.88);
    font-size: 14px;
    line-height: 1;
    list-style: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    position: relative;
    display: inline-flex;
    align-items: center;
    transition: border 0.2s, box-shadow 0.2s, background 0.2s;

    & > input {
        line-height: 20px;

        border: none;
        outline: none;
    }
`

const SearchTable = ({ columns }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filterFields, setFilterFields] = useState({});

    useEffect(() => {
        const filterCols = columns.filter(col => col.filter).flatMap(col => col.filter.condition === conditionType.between ? [`${col.filter.filterIndex}f`, `${col.filter.filterIndex}t`] : col.filter.filterIndex);

        const params = {};
        filterCols.forEach(col => {
            if (searchParams.has(col))
                params[col] = searchParams.get(col);
        });

        setFilterFields({ ...Object.fromEntries([...new URLSearchParams(params)]) });
    }, [searchParams]);

    const isFiltered = filterFields; // columns.some(column => searchParams.has(column.filter?.filterIndex));
    const renderFilterContent = (column) => {
        const map = {
            'text-contains': (
                <Input name={column.filter.filterIndex}
                    placeholder={`Nhập ${column.title}`}
                    value={filterFields[column.filter.filterIndex]}
                    onChange={e => setFilterFields({ ...filterFields, [column.filter.filterIndex]: e.target.value })} />
            ),
            'number-between': (
                <Space.Compact block>
                    <InputNumber
                        value={filterFields[`${column.filter.filterIndex}f`]}
                        onChange={value => setFilterFields({ ...filterFields, [`${column.filter.filterIndex}f`]: value })}
                        name={`${column.filter.filterIndex}f`}
                        placeholder={`${column.title} thấp nhất`}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                        style={{ width: '100%' }}
                    />

                    <InputNumber
                        value={filterFields[`${column.filter.filterIndex}t`]}
                        onChange={value => setFilterFields({ ...filterFields, [`${column.filter.filterIndex}t`]: value })}
                        name={`${column.filter.filterIndex}t`}
                        placeholder={`${column.title} cao nhất`}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                        style={{ width: '100%' }}
                    />
                </Space.Compact>
            ),
            'date-eq': (
                <StyledDateInput style={{ width: '100%' }}>
                    <input type="date" name={column.filter.filterIndex} value={filterFields[column.filter.filterIndex] ?? ''} onChange={e => setFilterFields({ ...filterFields, [column.filter.filterIndex]: e.target.value })} placeholder={`${column.title}`} />
                </StyledDateInput>
            ),
            'date-between': (
                <StyledDateInputRange>
                    <StyledDateInput>
                        <input type="date" name={`${column.filter.filterIndex}f`} value={filterFields[`${column.filter.filterIndex}f`] ?? ''} onChange={e => setFilterFields({ ...filterFields, [`${column.filter.filterIndex}f`]: e.target.value })} placeholder={`${column.title} từ`} />
                    </StyledDateInput>

                    <StyledDateInput>
                        <input type="date" name={`${column.filter.filterIndex}t`} value={filterFields[`${column.filter.filterIndex}t`] ?? ''} onChange={e => setFilterFields({ ...filterFields, [`${column.filter.filterIndex}t`]: e.target.value })} placeholder={`${column.title} đến`} />
                    </StyledDateInput>
                </StyledDateInputRange>
            ),
            'selection-eq': (
                <>
                    <Select
                        showSearch
                        allowClear
                        options={column.filter.options}
                        style={{ width: '100%' }}
                        value={filterFields[`${column.filter.filterIndex}`]}
                        placeholder={`Chọn ${column.title}`}
                        optionFilterProp="label"
                        onChange={(value) => {
                            column.filter.onFilter?.(searchParams);
                            if (!value) searchParams.delete(column.filter.filterIndex);
                            else searchParams.set(column.filter.filterIndex, value);
                            if (searchParams.get("page")) searchParams.delete("page");
                            setSearchParams(searchParams);
                        }}
                    />
                </>)
        }

        return map[`${column.filter.type}-${column.filter.condition}`];
    }

    const [collapsed, setCollapsed] = useState(false);

    const handleResetClick = () => {
        for (let key in filterFields) searchParams.delete(key);
        if (searchParams.get("page")) searchParams.delete("page");
        setSearchParams(searchParams);
    }

    return (
        <Card>
            <form onSubmit={(e) => {
                e.preventDefault();
                console.log(filterFields);
                for (let key in filterFields) {
                    if (!filterFields[key]) searchParams.delete(key);
                    else searchParams.set(key, filterFields[key]);
                }
                if (searchParams.get("page")) searchParams.delete("page");
                setSearchParams(searchParams);
            }}>
                <Grid>
                    {
                        columns.filter(col => col.filter).filter((_, index) => collapsed || index < 3).map(col => {
                            return <div>
                                {col.title}
                                {renderFilterContent(col)}
                            </div>
                        })
                    }

                    <Space>
                        <Button disabled={!isFiltered} type="text" onClick={handleResetClick}>Bỏ lọc</Button>
                        <Button type="primary" htmlType="submit">Tìm</Button>
                        {
                            columns.filter(col => col.filter).length > 3 &&
                            <Button type="link" onClick={() => setCollapsed(!collapsed)}>
                                {collapsed ? <span>Ẩn bớt <i className="bi bi-chevron-up"></i></span> : <span>Xem thêm <i className="bi bi-chevron-down"></i></span>}
                            </Button>
                        }
                    </Space>
                </Grid>
            </form>
        </Card>
    )
}

export default SearchTable;