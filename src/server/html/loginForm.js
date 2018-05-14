export default `
<main>
    <div style=" width: 200px; padding: 20px; margin: 200px auto; " id="login-form">
        <h3 style="text-align: center; margin-bottom: 10px;">Login</h3>
        <form method="POST" action="/login/authoryzation">
            <input style="margin-bottom: 4px; padding: 5px; width: 100%;" type="text" name="login" placeholder="User"/><br>
            <input style="margin-bottom: 4px; padding: 5px; width: 100%;" type="text" name="codesms" placeholder="SMS"/><br>
            <input style="padding: 5px; width: 100%;" type="password" name="password" placeholder="password"/><br>
            <button
                style="float: right;margin-top: 4px;background-color: dodgerblue;border: none;padding: 7px;border-radius: 3px;"
                type="submit"
            >
                Submit
            </button>
        </form>
    </div>
    <script>
        if (this.outerWidth < 800) {
            var form = document.querySelector('#login-form');
            var childrens = Array.prototype.slice.call(form.childNodes[3])
            childrens.map(function(node){
                return node.nodeName === "INPUT"
                ? node.style.height = '5%'
                : node
            });
            childrens[childrens.length-1].style.height = '5%'
            childrens[childrens.length-1].style.width = '20%'
            form.style.width = '95%';
        }
    </script>
</main>`;