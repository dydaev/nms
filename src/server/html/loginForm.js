export default `
<div style=" width: 164px; margin: 200px auto; ">
    <h3 style="text-align: center; margin-bottom: 10px;">Login</h3>
    <form method="POST" action="/login">
        <input style="margin-bottom: 4px; padding: 5px;" type="text" name="login" placeholder="login"/><br>
        <input style="padding: 5px;" type="password" name="password" placeholder="password"/><br>
        <button
            style="float: right;margin-top: 4px;background-color: dodgerblue;border: none;padding: 7px;border-radius: 3px;"
            type="submit"
        >
            Submit
        </button>
    </form>
</div>`;