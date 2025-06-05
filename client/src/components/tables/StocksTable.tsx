const StocksTable = () => {
  return (
    <>
        <table className="table table-danger table-hover">
            <thead>
                <b>Restock required</b>
                <tr>
                    <th>SKU</th>
                    <th>Name</th>
                    <th>Stocks Available</th>
                    <th>Threshold Value Alert</th>
                </tr>
            </thead>
            <tbody>
                <tr className="align-middle">
                    <td>30972527</td>
                    <td>Candy</td>
                    <td>8</td>
                    <td>15</td>
                </tr>
            </tbody>
        </table>

        <table className="table table-primary table-hover">
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Name</th>
                        <th>Stocks Available</th>
                        <th>Threshold Value Alert</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="align-middle">
                        <td>573210</td>
                        <td>Cookie</td>
                        <td>65</td>
                        <td>15</td>
                    </tr>
                </tbody>
            </table>
    </>
  )
}

export default StocksTable