import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
// import Typography from '@mui/material/Typography';
// import { Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { visuallyHidden } from '@mui/utils';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import tableData from '../data/Mock3.json';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#032538",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const theme = createTheme({
    components: {
        MuiTableSortLabel: {
            styleOverrides: {
                root: {
                    color: "lightgray",
                    "&:hover": {
                        color: "white"
                    },
                    "&.Mui-active": {
                        "&&": {
                            color: "white",

                            "& * ": {
                                color: "white"
                            }
                        }
                    }
                },
                icon: {
                    color: "white"
                }
            }
        }
    }
});

function createData(name, category, requested, status, quantity, description, timeOfRequest, inTime, outTime) {
    return {
        name,
        category,
        requested,
        status,
        quantity,
        description,
        timeOfRequest,
        inTime,
        outTime,
    };
}

const rows = tableData.sampleData.sample.map(data => createData(data['item-name'], data.category, data['requested-by'], data.requestStatus, data.quantity, data.description, data.timeOfRequest, data.inTime, data.outTime));

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Item name',
    },
    {
        id: 'category',
        numeric: false,
        disablePadding: false,
        label: 'Category',
    },
    {
        id: 'requested',
        numeric: false,
        disablePadding: false,
        label: 'Requested By',
    },
    {
        id: 'quantity',
        numeric: true,
        disablePadding: false,
        label: 'Quantity',
    },
    {
        id: 'duration',
        numeric: true,
        disablePadding: false,
        label: 'Duration',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Request Status',
    },
];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow >
                {headCells.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'center' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </StyledTableCell>
                ))}
                <StyledTableCell />
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    // onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function Row(props) {
    const { row, index } = props;
    const labelId = `enhanced-table-checkbox-${index}`;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow style={index % 2 ? { background: "#A2D5F2" } : { background: "#FAFAFA" }}>
                <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                >
                    {row.name}
                </TableCell>
                <TableCell align="left">{row.category}</TableCell>
                <TableCell align="left">{row.requested}</TableCell>
                <TableCell align="center">{row.quantity}</TableCell>
                <TableCell align="center">{row.quantity}</TableCell>
                <TableCell align="left"><p className={`italic font-medium ${row.status === 'Pending' ? "text-gray-500" : (row.status === 'Approved' ? "text-green-500" : "text-red-500")}`}>{row.status}</p></TableCell>
                <TableCell >
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <div className="flex px-8 py-8 gap-16">
                            <div className='w-full'>
                                {row.description}
                            </div>
                            <div className="flex flex-col gap-2 w-3/4 items-end">
                                <div>
                                    <span className='font-medium mr-4'>Time of Request : </span>
                                    <span> {row.timeOfRequest}</span>

                                </div>
                                <div>
                                    <span className='font-medium mr-4'>In Time : </span>
                                    <span> {row.inTime}</span>

                                </div>
                                <div>
                                    <span className='font-medium mr-4'>Out Time : </span>
                                    <span> {row.outTime}</span>

                                </div>
                                <div class="p-2 flex">
                                    <div class="mt-4 flex">
                                        {row.status === 'Pending' ?
                                            (<React.Fragment>
                                                <button type="submit" class="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded">Decline</button>
                                                <button type="submit" class="bg-transparent hover:bg-green-500 text-green-700 ml-6 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded">Approve</button>
                                            </React.Fragment>)
                                            :
                                            (row.status === 'Approved' ?
                                                <button type="submit" class="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded">Force Decline</button> :
                                                "")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function RequestReceived() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size='medium'
                        >
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {stableSort(rows, getComparator(order, orderBy))
                                    .map((row, index) =>
                                        <Row key={index} row={row} index={index} />
                                    )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </ThemeProvider>
    );
}