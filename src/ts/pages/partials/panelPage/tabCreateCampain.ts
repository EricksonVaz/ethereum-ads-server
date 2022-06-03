export default function tabCreateCampain(){
    return `
        <div class="tab-pane" id="create-campain">
            <form class="form-container form-create-campain">
                <div class="form-group control-name-campain">
                    <label for="name">Nome da campanha</label>
                    <input type="text" class="form-control" name="name">
                    <div class="form-feedback">Feedback aqui</div>
                </div>
                <div class="form-group-inline">
                    <div class="form-group">
                        <label for="tvm">TMV para Facturar</label>
                        <input type="number" class="form-control" name="tvm">
                        <div class="form-feedback"></div>
                    </div>
                    <div class="form-group">
                        <label for="totalViews">Meta total Views</label>
                        <input type="number" min="1" class="form-control" name="totalViews">
                        <div class="form-feedback"></div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="description">Meta total Views</label>
                    <textarea class="form-control" name="description"></textarea>
                    <div class="form-feedback"></div>
                </div>
                <div class="btn-action-group">
                    <button type="submit" class="btn">Publicar</button>
                    <button type="reset" class="btn">Cancelar</button>
                </div>
            </form>
        </div>
    `;
}