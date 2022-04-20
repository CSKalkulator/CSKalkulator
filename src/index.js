import React from 'react';
import ReactDOM from 'react-dom/client';

function DrawTable(props) {
    if (typeof (props) !== 'undefined') {
        //console.log(props.state.submit);
        if (props.state.submit === 'OK') {
            props.state.submit = 'NOTOK';
            props.state.datafiltered = []
            for (const row of props.state.data) {
                if (row.miasta.includes(props.state.miasto)) {
                    var KM_fixed = props.state.km - row.km_free;
                    var KM = props.state.km
                    if (KM>0 ) {
                        KM  = KM_fixed;
                    } else {
                        KM  =0;
                    }
                    row.Cena = row.start + (props.state.czas_jazdy * row.min_jazdy) + (props.state.czas_postoju * row.min_postoj) + (KM * row.km)
                    props.state.datafiltered.push(row)

                }
            }
            //props.state.datafiltered = props.state.data;
        }
        if (props.state.datafiltered.length > 0) {
            props.state.datafiltered = props.state.datafiltered.sort(function (a, b) {
                return a.Cena - b.Cena;
              });
              
            return (<table>
                <thead>
                    <tr><td><b>Operator</b></td><td><b>Koszt</b></td></tr>
                </thead><tbody>
                    <DrawTableEntries data={props.state.datafiltered} />
                </tbody>
            </table>
            )
        }
    }
}

    function DrawTableEntries(props) {
        var rows = []
        var i = 0;
        for (const abc of props.data) {
            rows.push(<tr key={i}>
                <td>{abc.nazwa}</td><td>{abc.Cena}</td>
            </tr>)
            i = i + 1
        }
        return rows;
    }


    class MyForm extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                km: 0,
                czas_jazdy: 0,
                czas_postoju: 0,
                miasto: 'Warszawa',
                data: [],
                submit: '',
                datafiltered: []
            };

            this.handleChange = this.handleChange.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.loadData();
        }


        handleChange(event) {
            if (event.target.name === 'czas_jazdy') {
                var czas_jazdy = parseFloat(event.target.value);
                if (isNaN(czas_jazdy)) {
                    czas_jazdy = 0;
                }
                this.setState({ czas_jazdy: czas_jazdy });
            }
            if (event.target.name === 'km') {
                var km = parseFloat(event.target.value);
                if (isNaN(km)) {
                    km = 0;
                }
                this.setState({ km: km });
            }
            if (event.target.name === 'czas_postoju') {
                var czas_postoju = parseFloat(event.target.value);
                if (isNaN(czas_postoju)) {
                    czas_postoju = 0;
                }
                this.setState({ czas_postoju: czas_postoju });
            }
            if (event.target.name === 'miasto') {
                this.setState({ miasto: event.target.value });
            }
            if (event.target.name === 'submit') {
                this.setState({ submit: event.target.value });
            }

        }
        async loadData() {
            const abc = await fetch('./data.json');
            const data2 = await abc.json();
            this.setState({ data: data2.ceny });
        }

        handleSubmit(event) {
            this.setState({ submit: 'OK' });
            event.preventDefault();
        }

        render() {
            return (
                <div>
                    <h1>Założenia:</h1>
                    * wybierasz miasto rozpoczęcia wynajmu<br/>
                    * cena za postój dotyczy godzin 7-23
                    <br/><br/>
                    <form onSubmit={this.handleSubmit}>
                    <label>
                        Kilometry:
                        <input type="text" name='km' value={this.state.km} onChange={this.handleChange} />
                    </label>
                    <label>
                        Czas jazdy (minuty):
                        <input type="text" name='czas_jazdy' value={this.state.czas_jazdy} onChange={this.handleChange} />
                    </label>
                    <label>
                        Czas postoju (minuty):
                        <input type="text" name='czas_postoju' value={this.state.czas_postoju} onChange={this.handleChange} />
                    </label>
                    <label>
                        Miasto:
                        <select name='miasto' value={this.state.value} onChange={this.handleChange}>
                            <option value="Warszawa">Warszawa</option>
                        </select>
                    </label>
                    <input type="submit" name='submit' />
                </form>

                    <DrawTable state={this.state} /></div>
            );
        }
    }

    /* ReactDOM
        .createRoot(document.getElementById('script_placeholder'))
        .render(<MyForm />); */

    const formContainer = document.getElementById('form_placeholder');
    const form = ReactDOM.createRoot(formContainer);
    form.render(<MyForm />)

//table.render(<DrawTable data={this.state.data} />);




