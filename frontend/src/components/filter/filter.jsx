import ClubSelect from './club_dropdown';
import CategorySelect from './category_dropdown';
import DayTime from './day_time';
import styled from "styled-components";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {CSVLink} from "react-csv";


const theme = createTheme({
  typography: {
    fontSize: 12,
  },
});

const FilterContent = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 32px 24px;
    gap: 30px;
`;

const FilterHead = styled.div`

    background-color: #032538;
    font-size: 20px;
    padding: 0px 24px;
    align-content: center;
    color: white;
    
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    
    width: 30vw;
    height: 60px;

    background: #032538;
`;

const Wrap = styled.div`

    width: min-content;
    align-items: center;
    height: 90vh;
    background-color: #FAFAFA;

`;

const ButtonCSV = styled.div`
  
  display: flexbox;
  width: fit-content;
  padding: 16px 8px;
  height: 36px;
  align-items: center;
  justify-content: center;
  background-color: #042537;
  color: #ffffff;
  border-radius: 4px;

`;


function Filter(props) {
  const { data, setStartDate, setEndDate, clubName, setClubName, catName, setCatName } = props;
  const headers = [

    {label : 'bill', key : 'bill'},
    {label : 'category', key : 'category'},
    {label : 'heldBy', key : 'heldBy'},
    {label : 'name', key : 'name'},
    {label : 'occupiedTime', key : 'occupiedTime'},
    {label : 'ownedBy', key : 'ownedBy'},
    {label : 'quantity', key : 'quantity'},
    {label : 'remarks', key : 'remarks'},
    {label : 'sanctionLetter', key : 'sanctionLetter'},
    {label : 'status', key : 'status'},
    {label : '__v', key : '__v'},
    {label : '_id', key : '_id'},
  
  ];
  
  const csvReport = {
  
    filename: "item-data.csv",
    headers : headers,
    data : (data ? data : [])
    
  };


  return (
    <Wrap>
      <FilterHead>Filters</FilterHead>
      <ThemeProvider theme={theme}>
        <FilterContent>
          <ClubSelect setClubName={setClubName} clubName={clubName} />
          <CategorySelect catName={catName} setCatName={setCatName} />
          <DayTime setStartDate={setStartDate} setEndDate={setEndDate} />
          <ButtonCSV><CSVLink {...csvReport}> Download CSV </CSVLink></ButtonCSV>
        </FilterContent>
      </ThemeProvider>
    </Wrap>
  );
}

export default Filter;