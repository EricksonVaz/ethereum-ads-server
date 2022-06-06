export default function formEditCampain(){
    return `
        <form class="form-container form-edit-campain d-none" data-id-pub="">
            <div class="form-group control-name-campain">
                <label for="name">Nome da campanha</label>
                <input type="text" class="form-control" name="name">
                <div class="form-feedback"></div>
            </div>
            <div class="form-group-inline">
                <div class="form-group">
                    <label for="tvm">TMV para Facturar</label>
                    <input type="number" class="form-control" name="tvm">
                    <div class="form-feedback"></div>
                </div>
                <div class="form-group">
                    <label for="goalview">Meta total Views</label>
                    <input type="number" class="form-control" name="goalview">
                    <div class="form-feedback"></div>
                </div>
            </div>
            <div class="form-group">
                <label for="description">Meta total Views</label>
                <textarea class="form-control" name="description"></textarea>
                <div class="form-feedback"></div>
            </div>
            <div class="btn-action-group">
                <button type="submit" class="btn">Editar</button>
                <button type="reset" class="btn btn-cancel-edit">Cancelar</button>
            </div>
        </form>
    `;
}