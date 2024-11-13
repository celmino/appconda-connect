<Page className="container" id="main">
    Hello World
    <span>Example Text</span>
    <Space>Test</Space>
    <Dialog>
        <AppCondaInput name={"test"}></AppCondaInput>
        <Select class="people_list">
            {{#each people }}
            <Select-Option value="sample">{{this.name}}</Select-Option>
            {{/each}}
        </Select>
    </Dialog>
</Page>