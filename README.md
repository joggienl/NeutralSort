NeutralSort
===========

NeutralSort is a DataTable plugin that puts the table back in it's original sorting state after "unsorting" the table.

# Usage

Be sure to include NeutralSort.js on your page. NeutralSort can be initialized as following:

```html
<table id="demo-table">
    <thead>
        <tr>
            <th>Rendering engine</th>
            <th>Browser</th>
            <th>Platform(s)</th>
            <th>Engine version</th>
            <th>CSS grade</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Trident</td>
            <td>Internet
                 Explorer 4.0</td>
            <td>Win 95+</td>
            <td>4</td>
            <td>X</td>
        </tr>
        <tr>
            <td>Trident</td>
            <td>Internet
                 Explorer 5.0</td>
            <td>Win 95+</td>
            <td>5</td>
            <td>C</td>
        </tr>
        <tr>
            <td>Trident</td>
            <td>Internet
                 Explorer 5.5</td>
            <td>Win 95+</td>
            <td>5.5</td>
            <td>A</td>
        </tr>

        <!-- ... -->

    </tbody>
</table>
```

```javascript
$('#demo-table').dataTable({
    sDom: 'Nlfrtip',
    bNeutralSort : true
});
```