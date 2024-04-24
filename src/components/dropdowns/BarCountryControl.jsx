import React, { useEffect } from 'react';

import Dropdown from 'react-bootstrap/Dropdown';

import { MdSettings } from "react-icons/md";
import { setBarCountries } from '../Store';
import { connect } from 'react-redux';
import { getDates, getScenerio, filterRegion, listRegions } from '../../assets/data/DataManager';
import Form from 'react-bootstrap/Form';

function BarChartControl({csv, scenerio, year, setCountries, countries}) {
  const changeCountries = (e, checked, country) => {
    if(countries.length >= 10)
      return;
    if(checked) {
      countries.push(country);
      let newList = Array.from(countries)
      setCountries(newList);
    }
    else {
      countries = countries.filter(i => i !== country);
      setCountries(countries);
    }
    
  }

  let aggregates = getDates(getScenerio(csv, scenerio), year);
  const countryList = listRegions(aggregates);
  countryList.sort();
  console.log("!", countries);
  let colors = []
  for (let i = 0; i < countryList.length; i++) {
    let country = countryList.at(i);
    colors.push(
      <Form.Check
        checked={countries.includes(country)}
        type="switch"
        id={country}
        label={country}
        onChange={e => {changeCountries(e, e.target.checked, country)}}
        //onClick={setCountries(countries.filter(c => c !== country))}
      />
  )
  }

  return (
    <Dropdown className = "choropleth-control">
      <Dropdown.Toggle variant="outline-secondary" size="sm" id="dropdown-basic">
        <MdSettings/>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {colors.map((c) => (c))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

function mapDispatchToProps(dispatch) {
  return {
      setCountries: (countryList) => dispatch(setBarCountries(countryList)),
  };
}

//Gets open scenerios, open guages, and the current selected guage from storage.
function mapStateToProps(state) {
  return {
      countries: state.barCountries,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BarChartControl);